import type { UserProfile } from "@/types/database";
import { ROLE_LABELS } from "@/lib/roles";

export function UserList({ users }: { users: UserProfile[] }) {
  if (users.length === 0) {
    return <p className="text-gray-500 text-sm py-12 text-center bg-white rounded-2xl border">Nenhum usuário cadastrado ainda.</p>;
  }
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Nome</th>
            <th className="text-left px-4 py-2">E-mail</th>
            <th className="text-left px-4 py-2">Role</th>
            <th className="text-left px-4 py-2">Cursos</th>
            <th className="text-left px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-2 font-medium">{u.name ?? "—"}</td>
              <td className="px-4 py-2 text-gray-600">{u.email}</td>
              <td className="px-4 py-2 text-gray-600">{ROLE_LABELS[u.role]}</td>
              <td className="px-4 py-2 text-gray-500 text-xs">{u.courses.join(", ") || "—"}</td>
              <td className="px-4 py-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {u.active ? "Ativo" : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
