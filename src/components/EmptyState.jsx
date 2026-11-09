export function EmptyState({ icon: Icon, text, children }) {
  return (
    <div className="empty">
      {Icon && <Icon size={56} strokeWidth={1.5} />}
      <p>{text}</p>
      {children}
    </div>
  );
}
