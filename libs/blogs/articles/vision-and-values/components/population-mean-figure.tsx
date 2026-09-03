import "./population-mean-figure.css";

export function PopulationMeanFigure() {
  return (
    <figure
      className="article-figure population-mean-figure"
      data-figure="company-mean-versus-typical-employee"
    >
      <div
        className="population-mean"
        role="img"
        aria-label="Illustrative company of 100 people: 80 employees earn $60,000, 15 managers earn $100,000, four directors earn $175,000, and one CEO earns $2.5 million. The typical employee earns $60,000, while the company average is $95,000."
      >
        <div className="population-mean__header" aria-hidden="true">
          <span>Illustrative company</span>
          <strong>100 people</strong>
        </div>

        <div className="population-mean__plot" aria-hidden="true">
          <div className="population-mean__row">
            <span className="population-mean__label">Employees</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--employee" />
            </span>
            <strong>80</strong>
          </div>
          <div className="population-mean__row">
            <span className="population-mean__label">Managers</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--manager" />
            </span>
            <strong>15</strong>
          </div>
          <div className="population-mean__row">
            <span className="population-mean__label">Directors</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--director" />
            </span>
            <strong>4</strong>
          </div>
          <div className="population-mean__row">
            <span className="population-mean__label">CEO</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--executive" />
            </span>
            <strong>1</strong>
          </div>
        </div>

        <div className="population-mean__comparison" aria-hidden="true">
          <div>
            <span>Typical employee</span>
            <strong>$60k</strong>
            <small>annual</small>
          </div>
          <span className="population-mean__inequality">≠</span>
          <div>
            <span>Company average</span>
            <strong>$95k</strong>
            <small>annual</small>
          </div>
        </div>

        <p className="population-mean__note" aria-hidden="true">
          No one earns the $95k average. It is accurate, but it does not describe the typical
          employee.
        </p>
      </div>
    </figure>
  );
}
