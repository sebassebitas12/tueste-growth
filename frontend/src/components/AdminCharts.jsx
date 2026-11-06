export function FunnelRows({ items }) {
  return items.map((step) => {
    const ratio = step.value / step.denominator;
    const percent = Math.round(ratio * 1000) / 10;
    const ratioText =
      step.step_key === "sent"
        ? `${ratio.toFixed(1).replace(".", ",")} invitaciones por persona que invita`
        : `${step.value} de ${step.denominator} · ${percent.toLocaleString("es-CR")}%`;
    return (
      <div className="funnel-row" key={step.step_key}>
        <span>
          {step.label}
          <small>{ratioText}</small>
        </span>
        <div>
          <i style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
        <strong>{step.value.toLocaleString("es-CR")}</strong>
      </div>
    );
  });
}

export function EconomicsRows({ items }) {
  return items.map((item) => (
    <div key={item.metric_key}>
      <span>{item.label}</span>
      <strong>{item.display_value}</strong>
      <small>{item.detail}</small>
    </div>
  ));
}
