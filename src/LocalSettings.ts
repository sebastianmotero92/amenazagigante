import { GameXBody } from "./GameXBody";

/**
 * Local settings management
 */
class LocalSettings {
  private game: GameXBody;
  private settings: Map<string, any>;

  constructor(game: GameXBody) {
    this.game = game;
    this.settings = new Map();
  }

  /**
   * Initialize settings
   */
  init(): void {
    console.log("Initializing local settings");
    this.loadSettings();
  }

  /**
   * Load settings from storage
   */
  private loadSettings(): void {
    const stored = localStorage.getItem('amenazagigante_settings');
    if (stored) {
      try {
        this.settings = new Map(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }

  /**
   * Save settings to storage
   */
  private saveSettings(): void {
    localStorage.setItem('amenazagigante_settings', JSON.stringify([...this.settings]));
  }

  /**
   * Get setting value
   */
  get(key: string, defaultValue?: any): any {
    return this.settings.get(key) ?? defaultValue;
  }

  /**
   * Set setting value
   */
  set(key: string, value: any): void {
    this.settings.set(key, value);
    this.saveSettings();
  }

  /**
   * Remove setting
   */
  remove(key: string): void {
    this.settings.delete(key);
    this.saveSettings();
  }

  /**
   * Clear all settings
   */
  clear(): void {
    this.settings.clear();
    this.saveSettings();
  }

  /**
   * Get all settings
   */
  getAll(): Map<string, any> {
    return new Map(this.settings);
  }
}