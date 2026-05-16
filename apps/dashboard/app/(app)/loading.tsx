export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-500">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Carregando...</span>
      </div>
    </div>
  );
}
