class SQLDatabase
{
    constructor (name, tables)
    {
        if (tables === undefined)
        {
            tables = [];
        }

        this.name = name;
        this.tables = tables;
        this.tableNames = [];
        for (let table of this.tables)
        {
            this.tableNames.push(table.name);
        }
    }

    addTable(table)
    {
        if (this.tableNames.includes(table.name))
        {
            throw `SQLError: Table already exists!`;
        }

        this.tables.push(table);
        this.tableNames.push(table.name);
    }

    static fromJsonString(josnStr)
    {
        return SQLDatabase.fromJson(JSON.parse(josnStr));
    }

    static fromJson(json)
    {
        let database = new SQLDatabase(json.name);

        for (let tableJson of json.tables)
        {
            let table = new SQLTable(tableJson.name);

            for (let rowJson of tableJson.rows)
            {
                let row = new SQLRow();

                for (let i = 0; i < tableJson.columns.length; i++)
                {
                    row.addColumn(new SQLAttribute(tableJson.columns[i], rowJson[i]));
                }

                table.addRow(row);
            }

            database.addTable(table);
        }

        return database;
    }

    print()
    {
        console.log(`Database: ${this.name}`);

        for (let table of this.tables)
        {
            table.print();
        }
    }

    _get(tableName)
    {
        for (let table of this.tables)
        {
            if (table.name == tableName)
            {
                return table;
            }
        }
    }

    execute(statement)
    {
        if (!(statement instanceof SQLStatement))
        {
            statement = SQLStatement.parse(statement);
        }

        console.log(statement);

        if (!this.tableNames.includes(statement.table))
        {
            throw `SQLError: Table ${statement.table} not found`;
        }

        return this._get(statement.table)[statement.type](statement.args);
    }
}

class SQLTable
{
    constructor (name, rows)
    {
        if (rows === undefined)
        {
            rows = [];
        }

        this.name = name;
        this.rows = rows;
    }

    addColumn (name)
    {
        for (let row of this.rows)
        {
            row.addColumn(name, null);
        }
    }

    addRow (row)
    {
        if (!this.checkRow(row))
        {
            throw `SQLError: Row cannot be added to table!`;
        }

        this.rows.push(row);
    }

    checkRow(row)
    {
        if (this.rows.length == 0)
        {
            return true;
        }

        if (row.length != this.rows[0].length)
        {
            return false;
        }

        for (let name of row.columnNames)
        {
            if (!this.rows[0].columnNames.includes(name))
            {
                return false;
            }
        }

        return true;
    }

    print()
    {
        console.log(`Table: ${this.name}`);
        for (let row of this.rows)
        {
            console.log(row);
        }
    }

    select(args)
    {
        console.log(args);

        let resultTable = new SQLTable(args.columns.toString());

        for (let row of this.rows)
        {
            let resultRow = row.select(args.columns, args.condition);
            if (!resultRow.empty())
            {
                resultTable.addRow(resultRow);
            }
        }

        return resultTable;
    }

    empty()
    {
        return this.rows.length == 0;
    }
}

class SQLRow
{
    constructor (columns)
    {
        if (columns === undefined)
        {
            columns = [];
        }

        this.columns = columns;
        this.columnNames = [];

        for (let column of this.columns)
        {
            this.columnNames.push(column.name);
        }
    }

    addColumn(attr, value)
    {
        if (!(attr instanceof SQLAttribute))
        {
            attr = new SQLAttribute(attr, value);   
        }

        if (this.columnNames.includes(attr.name))
        {
            this.setColumn(attr);
        }
        else
        {
            this.columnNames.push(attr.name);
            this.columns.push(attr);
        }

        return this;
    }

    setColumn(attr, value)
    {
        if (!(attr instanceof SQLAttribute))
        {
            attr = new SQLAttribute(attr, value);
        }

        for (let column of this.columns)
        {
            if (column.name == attr.name)
            {
                column.value = attr.value;
                break;
            }
        }

        throw `SQLError: Now column found by name <${attr.name}>`;
    }

    select (names, where)
    {
        let row = new SQLRow();
        let valuesForWhere = [];

        if (where !== undefined)
        {
            for (let columnToCheck of where.columns)
            {
                let added = false;
                for (let column of this.columns)
                {
                    if (columnToCheck == column.name)
                    {
                        valuesForWhere.push(column.value);
                        added = true;
                        break;
                    }
                }

                if(!added)
                {
                    throw `SQLError: Column ${columnToCheck} in where clause not found`;
                }
            }
        }

        if (where === undefined || where.condition(...valuesForWhere))
        {
            for (let column of this.columns)
            {
                if (names.length == 0 || names.includes(column.name))
                {
                    row.addColumn(column.clone());
                }
            }
        }

        return row;
    }

    empty ()
    {
        return this.columns.length == 0;
    }
}

class SQLAttribute
{
    constructor (name, value)
    {
        this.name = name;
        this.value = value;
    }

    clone ()
    {
        return new SQLAttribute(this.name, this.value);
    }
}

class SQLStatement
{
    constructor ()
    {}

    static parse(statement)
    {
        // console.log(statement);

        statement = SQLStatement._splitStatement(statement);

        console.log(statement);

        let keyWords = {
            "select": this._parseSelect,
            "insert,into": this._parseInsert,
            "update": this._parseUpdate,
            "delete,from": this._parseDelete
        };

        let statementType;

        for (let keyWord of Object.keys(keyWords))
        {
            if (keyWord == statement.slice(0, keyWord.split(",").length))
            {
                statementType = keyWords[keyWord];
                break;
            }
        }

        if (statementType === undefined)
        {
            throw `SQLError: ${statement[0]} isn't valid statement`;
        }

        return (statementType)(statement);
    }

    static _splitStatement(statement)
    {
        let specialSplitters = [",", "<", ">", "=", "<=", ">=", "(", ")"];
        let queryBreaks = [";", "--"];
        let splittedStatement = [];

        let phrase = "";

        let inString = false;

        while (statement != "")
        {
            if (!inString && queryBreaks.includes(phrase))
            {
                phrase = "";
                break;
            }
            else if (!inString && phrase.endsWith("--")) {
                phrase = phrase.substring(0, phrase.length - 2);
                break;
            }
            else if (!inString && phrase.endsWith(";")) {
                phrase = phrase.substring(0, phrase.length - 1);
                break;
            }

            let char = statement.charAt(0);
            statement = statement.slice(1);

            if (char == "'")
            {
                inString = !inString;
            }

            if (char == " " && !inString)
            {
                if (phrase != "") {
                    splittedStatement.push(phrase);
                    phrase = "";
                }
                continue;
            }
            else if (specialSplitters.includes(char))
            {
                if (phrase != "")
                {
                    splittedStatement.push(phrase);
                }

                if (statement.length > 1)
                {
                    if (specialSplitters.includes(char + statement.charAt(0)))
                    {
                        char += statement.charAt(0);
                        statement = statement.slice(1);
                    }
                }

                splittedStatement.push(char);
                phrase = "";
                continue;
            }

            phrase += char;
        }

        if (phrase != "")
        {
            splittedStatement.push(phrase);
        }

        return splittedStatement;
    }

    static _parseWhereClause(statement)
    {
        if (statement[0] != "where")
        {
            throw `SQLError: Expected where but found ${statement[0]}`;
        }

        statement = statement.splice(1);

        let conjunctors = ["or", "and"];
        let operators = ["=", "<", ">", ">=", "<=", "is"];

        let columns = [];
        let condition = "";

        function isNumber(str)
        {
            return !isNaN(parseFloat(str)) && isFinite(str);
        }

        let notFlag = 0;
        let dataFlag = true;
        let operatorFlag = false;
        let conjuctorFlag = false;

        while (statement.length > 0)
        {
            if (dataFlag && !operatorFlag && statement[0] == "not")
            {
                notFlag++;
                condition += "!(";
            }
            else if (dataFlag)
            {
                if (conjunctors.includes(statement[0]) || operators.includes(statement[0]))
                {
                    throw `SQLError: Expected data but found ${statement[0]}`;
                }

                condition += statement[0];

                if (statement[0] != "(")
                {
                    dataFlag = false;

                    if (operatorFlag)
                    {
                        operatorFlag = false;
                        conjuctorFlag = true;

                        if (!columns.includes(statement[0]) && !isNumber(statement[0]) && !statement[0].includes("'"))
                        {
                            columns.push(statement[0]);
                        }
                    }
                    else
                    {
                        operatorFlag = true;

                        if (!columns.includes(statement[0]) && !isNumber(statement[0]) && !statement[0].includes("'"))
                        {
                            columns.push(statement[0]);
                        }
                    }
                }
            }
            else if (operatorFlag)
            {
                if (!operators.includes(statement[0]))
                {
                    throw `SQLError: Expected operator but found ${statement[0]}`;
                }

                condition += statement[0].replace(/(?<![<>])(=)|(is)/g, "===");

                dataFlag = true;
            }
            else if (conjuctorFlag)
            {
                if (!conjunctors.includes(statement[0]) && statement[0] != ")")
                {
                    throw `SQLError: Expected conjunctor but found ${statement[0]}`;
                }

                if (notFlag > 0)
                {
                    condition += ")";
                    notFlag--;
                }

                condition += statement[0].replace("and", "&&").replace("or", "||");

                if (statement[0] != ")" || statement.length == 1)
                {
                    conjuctorFlag = false;
                    dataFlag = true;
                }
            }

            statement = statement.splice(1);
        }

        while (notFlag > 0)
        {
            condition += ")";
            notFlag--;
        }

        console.log(`return (${columns}) => ${condition}`);

        if (!(conjuctorFlag && !dataFlag && !operatorFlag))
        {
            if (dataFlag) throw `SQLError: Expected data or variable in where clause`;
            if (operatorFlag) throw `SQLError: Expected operator like '= < > <= >=' in where clause`;
        }

        try
        {
            return {
                "columns": columns,
                "condition": new Function(`return (${columns}) => ${condition}`)()
            };
        }
        catch (e)
        {
            throw `SQLError: Unexpected token while parsing where clause`;
        }
    }

    static _parseSelect(statement)
    {
        statement = statement.splice(1);
       //  console.log(statement);

        let columns = [];
        let table = "";
        let condition;

        let dataFlag = true;

        if (statement[0] != "*")
        {
            while (statement[0] != "from")
            {
                if (dataFlag && statement[0] == ",")
                {
                    throw `SQLError: Expected column name but found ,`;
                }
                else if (!dataFlag && statement[0] != ",")
                {
                    throw `SQLError: Expected , but found ${statement[0]}`;
                }

                if (dataFlag)
                {
                    if (statement[0].includes(" "))
                    {
                        throw `SQLError: Expected column name but found ${statement[0]}`;
                    }
                    columns.push(statement[0]);
                }

                dataFlag = !dataFlag;
                statement = statement.splice(1);
            }
        }
        else
        {
            statement = statement.splice(1);
        }

        // console.log(columns);
        // console.log(statement);

        if (statement[0] != "from")
        {
            throw `SQLError: Expected from but found ${statement[0]}`;
        }

        statement = statement.splice(1);

        if (statement[0] == "where")
        {
            throw `SQLError: Expected table name but found where`;
        }

        table = statement[0];

        if (table.includes(" "))
        {
            throw `SQLError: Expected table name but found ${table}`;
        }

        statement = statement.splice(1);

        // console.log(table);
        // console.log(statement);

        if (statement.length != 0)
        {
            condition = SQLStatement._parseWhereClause(statement);
        }

        return {
            type: "select",
            table: table,
            args: {
                columns: columns,
                condition: condition
            }
        };
    }

    static _parseInsert()
    {}

    static _parseUpdate()
    {}

    static _parseDelete()
    {}
}
