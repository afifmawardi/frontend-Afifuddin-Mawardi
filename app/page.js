"use client";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [negaraList, setNegaraList] = useState([]);
  const [pelabuhanList, setPelabuhanList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [selectedNegara, setSelectedNegara] = useState("");
  const [selectedPelabuhan, setSelectedPelabuhan] = useState("");
  const [selectedBarang, setSelectedBarang] = useState("");
  const [isLoadingNegara, setIsLoadingNegara] = useState(true);
  const [isLoadingPelabuhan, setIsLoadingPelabuhan] = useState(false);
  const [isLoadingBarang, setIsLoadingBarang] = useState(false);
  const [error, setError] = useState(null);

  function formatAngkaDenganTitik(num) {
    let str = num.toString().replace(/\./g, "");
    const number = parseFloat(str);

    if (isNaN(number)) return "0";

    // Format manual dengan regex
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Fetch data negara saat komponen dimount
  useEffect(() => {
    const fetchNegara = async () => {
      try {
        const response = await fetch("http://202.157.176.100:3001/negaras");

        if (!response.ok) {
          throw new Error("Gagal mengambil data negara");
        }

        const data = await response.json();
        setNegaraList(Array.isArray(data) ? data : []);
        setIsLoadingNegara(false);
      } catch (err) {
        setError(err.message);
        setIsLoadingNegara(false);
      }
    };

    fetchNegara();
  }, []);

  // Fetch data pelabuhan ketika negara dipilih
  useEffect(() => {
    // ketika negara belum dipilih
    if (!selectedNegara) {
      setPelabuhanList([]);
      return;
    }

    const fetchPelabuhan = async () => {
      try {
        setIsLoadingPelabuhan(true);
        const filter = encodeURIComponent(
          JSON.stringify({
            where: { id_negara: selectedNegara },
          })
        );

        const response = await fetch(
          `http://202.157.176.100:3001/pelabuhans?filter=${filter}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data pelabuhan");
        }

        const data = await response.json();
        setPelabuhanList(Array.isArray(data) ? data : []);
        setIsLoadingPelabuhan(false);
      } catch (err) {
        setError(err.message);
        setIsLoadingPelabuhan(false);
      }
    };

    fetchPelabuhan();
  }, [selectedNegara]);

  // Fetch data barang ketika pelabuhan dipilih
  useEffect(() => {
    if (!selectedPelabuhan) {
      setBarangList([]);
      return;
    }

    const fetchBarang = async () => {
      try {
        setIsLoadingPelabuhan(true);
        const filter = encodeURIComponent(
          JSON.stringify({
            where: { id_pelabuhan: selectedPelabuhan },
          })
        );

        const response = await fetch(
          `http://202.157.176.100:3001/barangs?filter=${filter}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data barang");
        }

        const data = await response.json();
        setBarangList(Array.isArray(data) ? data : []);
        setIsLoadingBarang(false);
      } catch (err) {
        setError(err.message);
        setIsLoadingBarang(false);
      }
    };

    fetchBarang();
  }, [selectedPelabuhan]);

  // change negara
  const handleNegaraChange = (e) => {
    setSelectedNegara(e.target.value);
    setSelectedPelabuhan(""); // Reset pilihan pelabuhan ketika negara berubah
  };

  // change pelabuhan
  const handlePelabuhanChange = (e) => {
    setSelectedPelabuhan(e.target.value);
    setSelectedBarang(""); // Reset pilihan barang ketika pelabuhan berubah
  };

  // change barang
  const handleBarangChange = (e) => {
    setSelectedBarang(e.target.value);
  };

  if (isLoadingNegara) {
    return <div>Memuat data negara...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto my-8 space-y-4">
      {/* Dropdown Negara */}
      <div>
        <label
          htmlFor="negara-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pilih Negara:
        </label>

        <select
          id="negara-select"
          value={selectedNegara}
          onChange={handleNegaraChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Pilih Negara --</option>
          {negaraList.map((negara) => (
            <option key={negara.id_negara} value={negara.id_negara}>
              {negara.kode_negara} - {negara.nama_negara}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Pelabuhan */}
      <div>
        <label
          htmlFor="pelabuhan-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pilih Pelabuhan:
        </label>

        <select
          id="pelabuhan-select"
          value={selectedPelabuhan}
          onChange={handlePelabuhanChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            -- {isLoadingPelabuhan ? "Memuat..." : "Pilih Pelabuhan"} --
          </option>
          {pelabuhanList.map((pelabuhan) => (
            <option key={pelabuhan.id_pelabuhan} value={pelabuhan.id_pelabuhan}>
              {pelabuhan.nama_pelabuhan}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Barang */}
      <div>
        <label
          htmlFor="barang-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pilih Barang:
        </label>

        <select
          id="barang-select"
          value={selectedBarang}
          onChange={handleBarangChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            -- {isLoadingBarang ? "Memuat..." : "Pilih Barang"} --
          </option>
          {barangList.map((barang) => (
            <option key={barang.id_barang} value={barang.id_barang}>
              {barang.id_barang} - {barang.nama_barang}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selection */}
      {selectedBarang && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="font-medium">Anda memilih:</p>
          <p>
            Negara:{" "}
            {
              negaraList.find((n) => n.id_negara.toString() === selectedNegara)
                ?.nama_negara
            }
          </p>
          <p>
            Pelabuhan:{" "}
            {
              pelabuhanList.find(
                (p) => p.id_pelabuhan.toString() === selectedPelabuhan
              )?.nama_pelabuhan
            }
          </p>
          <p>
            Barang:{" "}
            {
              barangList.find((p) => p.id_barang.toString() === selectedBarang)
                ?.nama_barang
            }
          </p>
          <p>
            Deskripsi:{" "}
            {
              barangList.find((p) => p.id_barang.toString() === selectedBarang)
                ?.description
            }
          </p>
          <p>
            Diskon:{" "}
            {
              barangList.find((p) => p.id_barang.toString() === selectedBarang)
                ?.diskon
            }
            %
          </p>
          <p>
            Harga: Rp.{" "}
            {formatAngkaDenganTitik(
              barangList.find((p) => p.id_barang.toString() === selectedBarang)
                ?.harga
            )}
          </p>
          <p>
            Total: Rp.{" "}
            {formatAngkaDenganTitik(
              barangList.find((p) => p.id_barang.toString() === selectedBarang)
                ?.harga -
                (barangList.find(
                  (p) => p.id_barang.toString() === selectedBarang
                )?.harga *
                  barangList.find(
                    (p) => p.id_barang.toString() === selectedBarang
                  )?.diskon) /
                  100
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
