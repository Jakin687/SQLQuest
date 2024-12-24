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
            throw `Table already exists!`;
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

    execute(statement)
    {
        if (!(statement instanceof SQLStatement))
        {
            statement = SQLStatement.parse(statement);
        }

        console.log(statement);
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
            throw `Row cannot be added to table!`;
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

        throw `Now column found by name <${attr.name}>`;
    }

    select (...names)
    {
        let row = new SQLRow();
        
        for (let column of this.columns)
        {
            if (names.includes(column.name))
            {
                row.addColumn(column.clone());
            }
        }

        return column;
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
        statement = statement.toLower();

        let keyWords = {
            "select": this.parseSelect,
            "insert into": this.parseInsert,
            "update": this.parseUpdate,
            "delete": this.parseDelete
        };

        let statementType = "";
        
        for (let keyWord of Object.keys(keyWords))
        {
            if (statement.startWith(keyWord))
            {
                statementType = keyWord;
                break;
            }
        }

        if (statementType == "")
        {
            throw "Error while parsing sql statement!";
        }

        return (statementType)(statement);
    }

    static _parseSelect(statement)
    {
        statement = statement.slice(7); // "select ".length

        let columnsToSelect = [];

        if (!statement.startWith("*"))
        {
            
        }
    }

    static _parseInsert()
    {}

    static _parseUpdate()
    {}

    static _parseDelete()
    {}
}
