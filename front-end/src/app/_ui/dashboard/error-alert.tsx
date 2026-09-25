type ErrorAlertProps = {
  error: Error | null;
  title: string;
};

export default function ErrorAlert({ error, title }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="bg-red-500 text-white p-4 rounded m-2">
      {title} Error: {error.message}
    </div>
  );
}
