const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function Heatmap({ data }: { data: number[][] }) {
  const max = Math.max(...data.flat(), 1);
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Cadastros por dia/hora</h3>
      <div className="overflow-x-auto">
        <table className="text-[10px]">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: 24 }, (_, h) => (
                <th key={h} className="w-4 text-center text-gray-400 font-normal">{h % 6 === 0 ? h : ""}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, d) => (
              <tr key={d}>
                <td className="text-gray-500 pr-2">{DAYS[d]}</td>
                {row.map((count, h) => {
                  const intensity = count / max;
                  return (
                    <td key={h} className="p-0.5">
                      <div className="w-4 h-4 rounded-sm" title={`${DAYS[d]} ${h}h: ${count}`}
                        style={{ background: `rgba(0, 150, 210, ${intensity})` }} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
