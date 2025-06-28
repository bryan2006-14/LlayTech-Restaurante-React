import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import qrImage from '../../assets/QR.png';
import { useOrder, usePayment, useTable } from '../../hooks';

export function YapePaymentInfo() {
  const navigate = useNavigate();
  const { tableNumber } = useParams();

  const { orders, getOrdersByTable } = useOrder();
  const { createPayment, addPaymentToOrder } = usePayment();
  const { getTableByNumber } = useTable();

  const [idTable, setIdTable] = useState(null);

  // Obtener ID de la mesa
  useEffect(() => {
    (async () => {
      const tableData = await getTableByNumber(tableNumber);
      if (tableData && tableData.length > 0) {
        setIdTable(tableData[0].id);
        getOrdersByTable(tableData[0].id, '', 'ordering=-status, -created_at');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para registrar el pago con Yape
  const onCreatePayment = async () => {
    if (!orders || !idTable) return;

    let totalPayment = 0;
    for (const order of orders) {
      totalPayment += Number(order.product_data.price);
    }

    const paymentData = {
      table: idTable,
      totalPayment: totalPayment.toFixed(2),
      paymentType: 'CARD', // Yape
      statusPayment: 'PENDING',
    };

    const payment = await createPayment(paymentData);

    for await (const order of orders) {
      await addPaymentToOrder(order.id, payment.id);
    }

    navigate(`/client/${tableNumber}/orders`);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Pagar con Yape</h1>
        <p style={paragraphStyle}>
          Escanea el siguiente código QR o usa los datos para transferir tu pago.
        </p>

        <div style={imageContainerStyle}>
          <img src={qrImage} alt="QR Yape" style={imageStyle} />
        </div>

        <div style={infoStyle}>
          <h3 style={phoneStyle}>📱 <strong>917 590 605</strong></h3>
          <p style={nameStyle}>Nombre: Restaurante Vallejano</p>
        </div>

        <Button
          icon
          labelPosition="left"
          color="orange"
  onClick={() => {
    // Crear el pago tipo "CARD" y luego redirigir
    onCreatePayment('CARD'); // 💳 Marca el pago como hecho por Yape
    navigate(`/client/${tableNumber}/orders`);
  }}          fluid
          style={buttonStyle}
        >
          <Icon name="check" />
          Ya pagué con Yape
        </Button>
      </div>

      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 480px) {
          h1 {
            font-size: 1.4rem !important;
          }
          p {
            font-size: 0.95rem !important;
          }
          img {
            object-position: center;
          }
        }

        @media (max-width: 360px) {
          .ui.button {
            font-size: 0.9rem !important;
            padding: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}

// 🧡 Estilos
const containerStyle = {
  padding: '2rem',
  background: 'linear-gradient(to right, #fff5e1, #ffe6cc)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: 'Segoe UI, sans-serif',
};

const cardStyle = {
  background: '#ffffff',
  borderRadius: '20px',
  padding: '2.5rem 2rem',
  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  maxWidth: '420px',
  width: '100%',
};

const imageContainerStyle = {
  width: '100%',
  height: '250px',
  overflow: 'hidden',
  borderRadius: '16px',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
};

const headingStyle = {
  color: '#ff7b00',
  marginBottom: '1rem',
  fontSize: '1.8rem',
};

const paragraphStyle = {
  color: '#555',
  fontSize: '1rem',
  marginBottom: '2rem',
};

const infoStyle = {
  marginBottom: '1.5rem',
};

const phoneStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '1.2rem',
  color: '#333',
};

const nameStyle = {
  margin: 0,
  fontSize: '1rem',
  color: '#666',
};

const buttonStyle = {
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: '0.9rem 0',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(255, 123, 0, 0.3)',
};
