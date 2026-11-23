export const MerchantIllustration = () => (
  <div className="flex h-full min-h-[220px] w-full flex-col gap-2 overflow-hidden rounded-xl bg-white p-3 text-[10px] text-gray-700">
    {/* Tabs */}
    <div className="flex items-center gap-1.5">
      <span className="rounded bg-[#0d4f47] px-2 py-1 text-[9px] font-bold text-white">
        Demand Live
      </span>
      <span className="rounded px-2 py-1 text-[9px] font-medium text-gray-500">
        Heatmap Area
      </span>
      <span className="rounded px-2 py-1 text-[9px] font-medium text-gray-500">
        Radius 5-25km
      </span>
    </div>

    {/* Mini KPIs (Toko & Leads, bukan checkout e-commerce) */}
    <div className="grid grid-cols-2 gap-1.5">
      <div className="rounded border border-gray-100 px-2 py-1.5">
        <p className="text-[8px] text-gray-400">Demand Signal</p>
        <p className="text-[11px] font-bold text-gray-900">128 Masuk</p>
      </div>
      <div className="rounded border border-gray-100 px-2 py-1.5">
        <p className="text-[8px] text-gray-400">Respon Chat</p>
        <p className="text-[11px] font-bold text-[#00c2a8]">94.2%</p>
      </div>
    </div>

    {/* Mini bar chart */}
    <div className="flex flex-1 items-end gap-1 rounded border border-gray-100 p-2">
      {[40, 65, 50, 80, 60, 90, 70, 55, 75, 85].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-gradient-to-t from-[#00c2a8] to-[#5fd9c4]"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>

    {/* Table rows: Leads & Discovery metrics, bukan order toko online */}
    <div className="flex flex-col gap-1">
      {[
        { label: 'Demand Signal Masuk', value: '128', delta: '+12%' },
        { label: 'Chat Terbalas', value: '119', delta: '+15%' },
        { label: 'Visits Profil Toko', value: '2.1K', delta: '+18%' },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between rounded bg-gray-50 px-2 py-1"
        >
          <span className="text-[9px] text-gray-500">{row.label}</span>
          <span className="text-[9px] font-bold text-gray-900">{row.value}</span>
          <span className="text-[8px] font-semibold text-[#00c2a8]">{row.delta}</span>
        </div>
      ))}
    </div>
  </div>
);
