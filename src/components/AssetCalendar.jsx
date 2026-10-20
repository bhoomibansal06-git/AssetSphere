import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { replaceData, store } from '../store/assetStore.js';
import { SessionProvider, useSession } from '../context/SessionContext.jsx';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const toDate = value => {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const normalized = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  if (match && (normalized.getFullYear() !== Number(match[1]) || normalized.getMonth() !== Number(match[2]) - 1 || normalized.getDate() !== Number(match[3]))) return null;
  return normalized;
};
const dateKey = value => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const formatDate = value => value ? value.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not scheduled';
const dayDiff = (start, end) => Math.floor((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86400000) + 1;

function Input({ label, children, ...props }) {
  return <label className="field calendar-filter"><span>{label}</span><select {...props}>{children}</select></label>;
}

export function AssetCalendar({ role }) {
  const dispatch = useDispatch();
  const data = useSelector(state => state.assetData.records);
  const session = useSession();
  const [cursor, setCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [view, setView] = useState('month');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [assetFilter, setAssetFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const refresh = () => dispatch(replaceData(JSON.parse(localStorage.getItem('as-data') || '{"employees":[],"assets":[],"requests":[]}')));
    window.addEventListener('assetsphere:data-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('assetsphere:data-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [dispatch]);

  const events = useMemo(() => {
    const visibleRequests = role === 'admin' ? data.requests : data.requests.filter(item => item.employee === session.user?.id);
    const requestEvents = visibleRequests.flatMap(request => {
      const start = toDate(request.startDate || request.date);
      const end = toDate(request.endDate || request.startDate || request.date);
      if (!start || !end || end < start) return [];
      const person = data.employees.find(item => item.id === request.employee);
      const eventType = request.type === 'Repair' ? 'Maintenance' : 'Request';
      return [{
        id: request.id, requestId: request.id, title: request.asset || request.type,
        start, end, duration: dayDiff(start, end), employee: person?.name || request.employee,
        employeeId: request.employee, asset: request.asset || 'Unspecified asset',
        status: request.status || 'Unspecified', type: eventType, description: request.description || '',
        conflictKey: request.assetId || request.asset
      }];
    });
    const assignmentEvents = data.assets.flatMap(asset => {
      if (!asset.issued || !asset.due) return [];
      const start = toDate(asset.issued);
      const end = toDate(asset.due);
      if (!start || !end || end < start) return [];
      const person = data.employees.find(item => item.id === asset.employee);
      if (role !== 'admin' && asset.employee !== session.user?.id) return [];
      return [{ id: `assignment-${asset.id}`, title: `${asset.name} assignment`, start, end, duration: dayDiff(start, end),
        employee: person?.name || person?.id || 'Unassigned', employeeId: asset.employee, asset: asset.name,
        status: 'Assigned', type: 'Assignment', description: `Assignment period for ${asset.name}. Expected return ${formatDate(end)}.`, conflictKey: asset.id }];
    });
    return [...requestEvents, ...assignmentEvents].map(event => ({ ...event,
      conflict: requestEvents.some(other => other.id !== event.id && other.conflictKey === event.conflictKey && other.start <= event.end && other.end >= event.start)
    }));
  }, [data, role, session.user?.id]);

  const filteredEvents = events.filter(event => (!employeeFilter || event.employeeId === employeeFilter)
    && (!assetFilter || event.asset === assetFilter)
    && (!statusFilter || event.status === statusFilter)
    && (!typeFilter || event.type === typeFilter));

  const visibleDays = useMemo(() => {
    if (view === 'day') return [new Date(cursor)];
    if (view === 'week') {
      const first = new Date(cursor);
      first.setDate(first.getDate() - first.getDay());
      return Array.from({ length: 7 }, (_, index) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + index));
    }
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    first.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + index));
  }, [cursor, view]);

  const eventsOn = day => filteredEvents.filter(event => event.start <= day && event.end >= day);
  const move = offset => setCursor(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  const unique = key => [...new Set(events.map(event => event[key]).filter(Boolean))];

  return <section className="panel calendar-panel">
    <div className="panel-title">Asset calendar <span>{role === 'admin' ? 'All employee schedules' : 'Your requests and assignments'}</span></div>
    <div className="calendar-toolbar">
      <div className="calendar-navigation">
        <button className="btn btn-outline" onClick={() => move(-1)} aria-label="Previous month">←</button>
        <button className="btn btn-outline" onClick={() => setCursor(new Date())}>Today</button>
        <button className="btn btn-outline" onClick={() => move(1)} aria-label="Next month">→</button>
        <strong>{monthNames[cursor.getMonth()]} {cursor.getFullYear()}</strong>
      </div>
      <div className="calendar-views">{['month', 'week', 'day'].map(item => <button key={item} className={`btn ${view === item ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView(item)}>{item}</button>)}</div>
    </div>
    {role === 'admin' && <div className="calendar-filters">
      <Input label="EMPLOYEE" value={employeeFilter} onChange={event => setEmployeeFilter(event.target.value)}><option value="">All employees</option>{data.employees.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</Input>
      <Input label="ASSET" value={assetFilter} onChange={event => setAssetFilter(event.target.value)}><option value="">All assets</option>{unique('asset').map(asset => <option key={asset}>{asset}</option>)}</Input>
      <Input label="STATUS" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="">All statuses</option>{unique('status').map(status => <option key={status}>{status}</option>)}</Input>
      <Input label="EVENT TYPE" value={typeFilter} onChange={event => setTypeFilter(event.target.value)}><option value="">All types</option>{unique('type').map(type => <option key={type}>{type}</option>)}</Input>
    </div>}
    <div className={`calendar-grid ${view}`}>
      {view === 'month' && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div className="calendar-weekday" key={day}>{day}</div>)}
      {visibleDays.map(day => <div className={`calendar-day ${view === 'month' && day.getMonth() !== cursor.getMonth() ? 'outside-month' : ''} ${dateKey(day) === dateKey(new Date()) ? 'today' : ''}`} key={dateKey(day)}>
        <div className="calendar-day-heading">{view === 'month' ? day.getDate() : day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        {eventsOn(day).map(event => <button key={event.id} className={`calendar-event ${event.conflict ? 'conflict' : ''}`} onClick={() => setSelected(event)} title={`${event.title} · ${event.status}${event.conflict ? ' · Potential conflict' : ''}`}>
          <span>{event.title}</span><small>{event.type} · {event.status}{event.conflict ? ' · Conflict' : ''}</small>
        </button>)}
      </div>)}
    </div>
    {!filteredEvents.length && <div className="empty">No calendar events match this period or filter.</div>}
    {selected && <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}><section className="modal calendar-detail" role="dialog" aria-modal="true" aria-labelledby="calendar-event-title">
      <div className="modal-head"><div><h2 id="calendar-event-title">{selected.title}</h2><p>{selected.type} · {selected.status}</p></div><button className="close" onClick={() => setSelected(null)} aria-label="Close details">×</button></div>
      <div className="detail-grid"><div><span>Employee</span><b>{selected.employee}</b></div><div><span>Asset</span><b>{selected.asset}</b></div><div><span>Start date</span><b>{formatDate(selected.start)}</b></div><div><span>End / return date</span><b>{formatDate(selected.end)}</b></div><div><span>Duration</span><b>{selected.duration} day{selected.duration === 1 ? '' : 's'}</b></div><div><span>Scheduling</span><b>{selected.conflict ? 'Potential overlap' : 'No detected overlap'}</b></div><div style={{ gridColumn: '1 / -1' }}><span>Details</span><b>{selected.description || 'No additional notes.'}</b></div></div>
      {role === 'admin' && selected.requestId && <div className="modal-actions"><button className="btn btn-outline" onClick={() => { setSelected(null); window.requestModal?.(selected.requestId); }}>Open request workflow</button></div>}
    </section></div>}
  </section>;
}

let activeRoot;
window.mountAssetCalendar = (element, role) => {
  activeRoot = createRoot(element);
  const session = JSON.parse(localStorage.getItem('as-session') || 'null') || { role, user: null };
  activeRoot.render(<Provider store={store}><SessionProvider value={session}><AssetCalendar role={role} /></SessionProvider></Provider>);
};
window.unmountAssetCalendar = () => {
  if (activeRoot) activeRoot.unmount();
  activeRoot = null;
};

