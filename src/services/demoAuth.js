export async function signInDemo({ role, email, password }) {
  await Promise.resolve();
  if (password.length < 6) throw new Error('Use at least 6 characters for this demo.');

  const data = window.getAssetData?.() || { employees: [] };
  const user = role === 'employee'
    ? data.employees.find(person => person.email.toLowerCase() === email.toLowerCase()) || data.employees[0]
    : { name: 'Ishaan Verma', id: 'ADM-1007', email };

  if (!user) throw new Error('No employee record is available in this browser.');
  return { role, user };
}

export async function createDemoAccount({ role, name, email, phone, department }) {
  await Promise.resolve();
  const user = {
    name,
    email,
    id: `${role === 'admin' ? 'ADM' : 'EMP'}-${Date.now().toString().slice(-6)}`,
    department,
    phone,
    role: role === 'admin' ? 'Administrator' : 'Team member',
    address: 'Not provided',
    joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  if (role === 'employee') {
    const existing = window.getAssetData?.() || { employees: [] };
    if (existing.employees.some(person => person.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    window.addEmployeeRecord?.(user);
  }

  return { role, user };
}
