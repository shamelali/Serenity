"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui/primitives";
import { useDictionary, useLocalizedHref } from "@/lib/i18n/locale-context";
import { STATE_DISTRICTS, getAllCities } from "@/lib/malaysia-locations";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = useDictionary();
  const buildHref = useLocalizedHref();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "all");
  const [type, setType] = useState(searchParams.get("type") ?? "all");
  const [state, setState] = useState(searchParams.get("state") ?? "all");
  const [isPending, startTransition] = useTransition();

  const allCities = useMemo(() => getAllCities(), []);
  const availableCities = useMemo(() => {
    if (state === "all" || !state) return allCities;
    return STATE_DISTRICTS[state] || [];
  }, [state, allCities]);

  useEffect(() => {
    if (city !== "all" && !availableCities.includes(city)) {
      setCity("all");
    }
  }, [availableCities, city]);

  function applyFilters(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city !== "all") params.set("city", city);
    if (type !== "all") params.set("type", type);
    if (state !== "all") params.set("state", state);
    startTransition(() => {
      router.push(`${buildHref("/")}?${params.toString()}`);
    });
  }

  function handleStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newState = e.target.value;
    setState(newState);
    if (newState !== "all" && city !== "all") {
      const districts = STATE_DISTRICTS[newState] || [];
      if (!districts.includes(city)) {
        setCity("all");
      }
    }
  }

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
    >
      {/* First Line: Search - full width */}
      <div className="sm:grid sm:grid-cols-[1fr_auto] sm:gap-3 sm:items-end">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">{dict.search.searchLabel}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={dict.search.searchPlaceholder}
              className="pl-9"
            />
          </div>
        </div>
        <Button type="submit" loading={isPending} className="h-[42px] w-full sm:w-auto">
          {dict.search.searchButton}
        </Button>
      </div>

      {/* Second Line: Type -> State -> City */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">{dict.search.typeLabel}</label>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">{dict.search.allTypes}</option>
            {Object.entries(dict.providerTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">{dict.search.stateLabel}</label>
          <Select value={state} onChange={handleStateChange}>
            <option value="all">{dict.search.allStates}</option>
            {Object.entries(dict.states).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">{dict.search.cityLabel}</label>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="all">{dict.search.allCities}</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </form>
  );
}