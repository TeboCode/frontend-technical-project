type LogoutButtonProps = {
  className?: string;
};

// TODO: wire up to a Server Action once authentication is in place.
export function LogoutButton({ className = "" }: LogoutButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-sm bg-danger px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-danger-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger ${className}`}
    >
      Log Out
    </button>
  );
}
