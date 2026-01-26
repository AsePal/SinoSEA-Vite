interface Props {
  title: string;
  paragraphs?: string[];
  list?: string[];
  highlight?: string;
}

export default function PolicySection({ title, paragraphs, list, highlight }: Props) {
  return (
    <section className="mb-7">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-3 border-b pb-3">{title}</h2>

      {paragraphs?.map((p, i) => (
        <p key={i} className="text-gray-700 mb-3 leading-relaxed">
          {p}
        </p>
      ))}

      {list && (
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      {highlight && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded text-sm text-gray-700">
          {highlight}
        </div>
      )}
    </section>
  );
}
