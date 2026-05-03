import { writable } from 'svelte/store';

export interface SystemStats {
  model: string;
  n_ctx: number;
  build: string;
  slots: number;
  active_slots: number;
  last_eval_time: string;
  last_eval_speed: string;
  logs: string[];
}

const defaultStats: SystemStats = {
  model: 'Loading...',
  n_ctx: 0,
  build: 'Unknown',
  slots: 0,
  active_slots: 0,
  last_eval_time: '0ms',
  last_eval_speed: '0 t/s',
  logs: ['[INFO] Initializing system...', '[INFO] Connecting to llama.cpp...']
};

export const systemStats = writable<SystemStats>(defaultStats);

export const updateStats = async (baseUrl: string) => {
  try {
    const propsRes = await fetch(`${baseUrl}/props`);
    if (!propsRes.ok) throw new Error('Failed to fetch props');
    const props = await propsRes.json();

    const slotsRes = await fetch(`${baseUrl}/slots`);
    if (!slotsRes.ok) throw new Error('Failed to fetch slots');
    const slots = await slotsRes.json();

    const activeSlots = slots.filter((s: any) => s.is_processing).length;
    
    systemStats.update(s => ({
      ...s,
      model: props.model_alias || 'Unknown Model',
      n_ctx: props.n_ctx || 0,
      build: props.build_info || 'Unknown',
      slots: props.total_slots || 0,
      active_slots: activeSlots,
      logs: [...s.logs.slice(-10), `[DEBUG] Polled slots: ${activeSlots}/${props.total_slots} active`]
    }));
  } catch (err) {
    console.error('Stats update error:', err);
  }
};

export const pushLog = (log: string) => {
  systemStats.update(s => ({
    ...s,
    logs: [...s.logs.slice(-50), `[${new Date().toLocaleTimeString()}] ${log}`]
  }));
};

export const updateTimings = (evalMs: number, tokenCount: number) => {
  const speed = (tokenCount / (evalMs / 1000)).toFixed(2);
  systemStats.update(s => ({
    ...s,
    last_eval_time: `${evalMs.toFixed(0)}ms`,
    last_eval_speed: `${speed} t/s`
  }));
};
