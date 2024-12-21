class Stage
{
    constructor (title, dom, problem, tips, solution)
    {
        
    }
}

class StageBuilder
{
    constructor () {
        this.vTitle = "";
        this.vDom = "";
        this.vProblem = "";
        this.vTips = [];
        this.vSolution = "";
    }

    static _createTipElement(tip)
    {
        let box = document.createElement("div");
    }

    title(title)
    {
        this.vTitle = title;
        return this;
    }

    dom(dom)
    {
        this.vDom = dom;
        return this;
    }

    problem(problem)
    {
        this.vProblem = problem;
        return this;
    }

    tips(tips)
    {
        this.vTips = tips.map(t => StageBuilder._createTipElement(t));
        return this;
    }

    solution(solution)
    {
        this.vSolution = solution;
        return this;
    }

    build()
    {
        return new Stage(
            this.vTitle,
            this.vDom,
            this.vProblem,
            this.vTips,
            this.vSolution);
    }
}
