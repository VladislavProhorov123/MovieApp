import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_OPTIONS } from "../api/tmdb";
import { Link } from "react-router-dom";

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActors = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/person/popular`, API_OPTIONS);

        const data = await res.json();
        setActors(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

  return (
    <div className="min-h-screen text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0d23] to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">
        <h1 className="text-4xl font-bold mb-10">Actors</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {actors.map((actor) => (
              <Link key={actor.id} to={`/actor/${actor.id}`}>
                <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition">
                  <img
                    className="w-full h-[220px] object-cover"
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300/${actor.profile_path}`
                        : "/no-avatar.png"
                    }
                  />

                  <div className="p-2">
                    <p className="text-sm text-center">{actor.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
