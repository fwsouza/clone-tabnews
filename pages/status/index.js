import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(`http://localhost:3000${key}`);
  const responseBody = response.json();
  return responseBody;
}

const LOADING_TEXT = "Loading...";

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <StatusInformation />
    </>
  );
}

function StatusInformation() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const db = data?.dependencies?.database;

  const getValue = (value) =>
    !isLoading && value !== undefined ? value : LOADING_TEXT;

  return (
    <div>
      Last update:{" "}
      {getValue(
        data?.updated_at
          ? new Date(data.updated_at).toLocaleString("pt-BR")
          : undefined,
      )}
      <br />
      Database version: {getValue(db?.version)}
      <br />
      Max connections: {getValue(db?.max_connections)}
      <br />
      Opened connections: {getValue(db?.opened_connections)}
    </div>
  );
}
