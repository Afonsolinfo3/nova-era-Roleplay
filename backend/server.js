import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";  // Importação corrigida para v2
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Servir assets de /assets
app.use('/assets', express.static('../assets'));
console.log("Servindo assets de ../assets em /assets");

// Access Token do Mercado Pago - Substitua pelo token real
const ACCESS_TOKEN = "APP_USR-4553469605724432-021318-eb5639f4c2d67d8ebf174a13b522944e-3102930265";

// Configuração corrigida para v2
const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
console.log("Mercado Pago configurado com token:", ACCESS_TOKEN ? "Token definido" : "Token ausente");

app.post("/create-payment", async (req, res) => {
  const { id, title, price } = req.body;
  console.log("Recebida requisição de pagamento:", { id, title, price });

  if (!id || !title || !price || isNaN(price)) {
    console.error("Dados inválidos na requisição:", { id, title, price });
    return res.status(400).json({ error: "Dados inválidos." });
  }

  const preferenceData = {
    items: [{ id, title, unit_price: Number(price), quantity: 1, currency_id: "BRL" }],
    back_urls: {
      success: "http://localhost:3000/frontend/sucesso.html",
      failure: "http://localhost:3000/frontend/falha.html",
      pending: "http://localhost:3000/frontend/pendente.html"
    },
    auto_return: "approved"
  };

  try {
    console.log("Criando preferência no Mercado Pago...");
    const preference = new Preference(client);  // Instanciação corrigida
    const response = await preference.create({ body: preferenceData });  // Correção para v2
    console.log("Preferência criada com sucesso! Init point:", response.init_point);
    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência no Mercado Pago:", error.message);
    console.error("Detalhes do erro:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static('../frontend'));

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));