import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Pokemon = () => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ?name=… aus der URL auslesen
  const { search } = useLocation();
  const pokemonName = new URLSearchParams(search).get("name")?.toLowerCase(); // ← klein schreiben

  useEffect(() => {
    if (!pokemonName) return;

    const fetchPokemon = async () => {
      try {
        const res = await fetch(
          `https://pokedex.mimo.dev/api/pokemon/${pokemonName}`
        );
        if (!res.ok) throw new Error("Pokémon not found");

        const data = await res.json();
        setPokemon(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonName]);

  /* ---------- Render ---------- */
  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{pokemon.name}</h1>

      {/* korrektes Feld: front_default */}
      {pokemon.sprites?.front_default && (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      )}

      {pokemon.height && <p>Height: {pokemon.height}</p>}
      {pokemon.weight && <p>Weight: {pokemon.weight}</p>}

      {pokemon.abilities && (
        <p>
          <strong>Abilities:</strong>{" "}
          {pokemon.abilities.map((a) => a.ability.name).join(", ")}
        </p>
      )}

      {pokemon.types && (
        <p>
          <strong>Types:</strong>{" "}
          {pokemon.types.map((t) => t.type.name).join(", ")}
        </p>
      )}
    </div>
  );
};

export default Pokemon;
