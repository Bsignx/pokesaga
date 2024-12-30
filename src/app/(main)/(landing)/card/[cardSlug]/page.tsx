interface CardPageProps {
  params: { cardSlug: string };
}

async function fetchCardPrice(cardSlug: string) {
  console.log({ cardSlug });
  const res = await fetch(`http://localhost:3000/api/card/${cardSlug}`, {
    cache: "no-store",
  });
  console.log({ res });
  if (!res.ok) {
    return { priceData: null, source: "unknown" };
  }
  return res.json();
}

async function CardPage({ params }: CardPageProps) {
  const result = await params;
  console.log({ result });
  const { priceData, source } = await fetchCardPrice(result.cardSlug);

  return (
    <div>
      <h1>Card ID: {result.cardSlug}</h1>
      {priceData ? (
        <div>
          <h2>Normal Price</h2>
          <p>Min: R$ {priceData.normal.min}</p>
          <p>Medium: R$ {priceData.normal.medium}</p>
          <p>Max: R$ {priceData.normal.max}</p>

          <h2>Foil Price</h2>
          <p>Min: R$ {priceData.foil.min}</p>
          <p>Medium: R$ {priceData.foil.medium}</p>
          <p>Max: R$ {priceData.foil.max}</p>

          <p>Source: {source}</p>
        </div>
      ) : (
        <p>Price not available</p>
      )}
    </div>
  );
}

export default CardPage;
