interface IInstances {
  [key: string]: IInstanceConfig;
}

interface IInstanceConfig {
  cpu: number;
  ram: number;
  gpu?: number;
  label?: string;
  display_ram: number;
}

export const INSTANCE_CONFIG: IInstances = {
  small: {
    cpu: 1024 * 2,
    ram: Math.floor(1024 * 3.7),
    display_ram: 1024 * 4,
  },
  medium: {
    cpu: 1024 * 4,
    ram: 1024 * 15,
    display_ram: 1024 * 16,
  },
  large: {
    cpu: 1024 * 32,
    ram: 1024 * 230,
    display_ram: 1024 * 240,
  },
};
