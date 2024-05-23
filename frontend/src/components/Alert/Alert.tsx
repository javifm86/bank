interface Props {
  message: string;
}
function Alert({ message }: Props) {
  return (
    <div className="px-6 py-4 bg-red-100 text-red-700">
      <span className="font-bold">Error: </span> {message}
    </div>
  );
}
export default Alert;
