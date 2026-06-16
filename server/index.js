import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

function mapService(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    duration: row.duration,
    description: row.description,
  };
}

function mapAppointment(row) {
  return {
    id: row.id,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    clientEmail: row.client_email,
    serviceId: row.service_id,
    serviceName: row.service_name,
    servicePrice: Number(row.service_price),
    barberId: row.barber_id,
    barberName: row.barber_name,
    date: row.appointment_date,
    time: row.appointment_time,
    notes: row.notes,
    status: row.status,
  };
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

app.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true });
});

app.get("/api/services", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, price, duration, description FROM services ORDER BY created_at ASC",
    );
    res.json(result.rows.map(mapService));
  } catch (error) {
    next(error);
  }
});

app.post("/api/services", async (req, res, next) => {
  try {
    const { name, price, duration, description } = req.body;

    if (!name || !description || Number(price) <= 0 || Number(duration) <= 0) {
      return res.status(400).json({ message: "Invalid service payload." });
    }

    const id = createId("s");
    const result = await pool.query(
      `
      INSERT INTO services (id, name, price, duration, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, price, duration, description
      `,
      [id, name, Number(price), Number(duration), description],
    );

    res.status(201).json(mapService(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/services/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM services WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Service not found." });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get("/api/appointments", async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        client_name,
        client_phone,
        client_email,
        service_id,
        service_name,
        service_price,
        barber_id,
        barber_name,
        appointment_date::text,
        appointment_time,
        notes,
        status
      FROM appointments
      ORDER BY appointment_date DESC, appointment_time DESC
    `);

    res.json(result.rows.map(mapAppointment));
  } catch (error) {
    next(error);
  }
});

app.post("/api/appointments", async (req, res, next) => {
  try {
    const {
      clientName,
      clientPhone,
      clientEmail,
      serviceId,
      serviceName,
      servicePrice,
      barberId,
      barberName,
      date,
      time,
      notes,
      status,
    } = req.body;

    if (
      !clientName ||
      !clientPhone ||
      !clientEmail ||
      !serviceName ||
      !barberId ||
      !barberName ||
      !date ||
      !time
    ) {
      return res.status(400).json({ message: "Invalid appointment payload." });
    }

    const id = createId("a");
    const safeStatus = ["Pending", "Completed", "Cancelled"].includes(status)
      ? status
      : "Pending";

    const result = await pool.query(
      `
      INSERT INTO appointments (
        id,
        client_name,
        client_phone,
        client_email,
        service_id,
        service_name,
        service_price,
        barber_id,
        barber_name,
        appointment_date,
        appointment_time,
        notes,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING
        id,
        client_name,
        client_phone,
        client_email,
        service_id,
        service_name,
        service_price,
        barber_id,
        barber_name,
        appointment_date::text,
        appointment_time,
        notes,
        status
      `,
      [
        id,
        clientName,
        clientPhone,
        clientEmail,
        serviceId || null,
        serviceName,
        Number(servicePrice) || 0,
        barberId,
        barberName,
        date,
        time,
        notes || "",
        safeStatus,
      ],
    );

    res.status(201).json(mapAppointment(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/appointments/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status." });
    }

    const result = await pool.query(
      `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        client_name,
        client_phone,
        client_email,
        service_id,
        service_name,
        service_price,
        barber_id,
        barber_name,
        appointment_date::text,
        appointment_time,
        notes,
        status
      `,
      [status, req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.json(mapAppointment(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
