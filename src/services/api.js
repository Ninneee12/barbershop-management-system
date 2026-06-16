const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchServices() {
  return request("/api/services");
}

export function createService(service) {
  return request("/api/services", {
    method: "POST",
    body: JSON.stringify(service),
  });
}

export function deleteService(id) {
  return request(`/api/services/${id}`, {
    method: "DELETE",
  });
}

export function fetchAppointments() {
  return request("/api/appointments");
}

export function createAppointment(appointment) {
  return request("/api/appointments", {
    method: "POST",
    body: JSON.stringify(appointment),
  });
}

export function updateAppointmentStatus(id, status) {
  return request(`/api/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
