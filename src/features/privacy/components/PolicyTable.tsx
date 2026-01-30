interface Props {
  title: string;
  headers: string[];
  rows: string[][];
}

export default function PolicyTable({ title, headers, rows }: Props) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
          <thead className="bg-indigo-500 dark:bg-indigo-600 text-white">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="even:bg-gray-50 dark:even:bg-gray-800/50 odd:bg-white dark:odd:bg-gray-800"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
