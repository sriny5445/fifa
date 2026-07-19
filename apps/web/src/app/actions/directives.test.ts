import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processTelemetryAndGetDirective } from './directives';
import { StadiumTelemetry } from '@fifa/core';

describe('Directives Server Action', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'AIzaSyYourValidatedStudioKey');
  });

  it('should handle completely empty or null telemetry payload safely', async () => {
    const directive = await processTelemetryAndGetDirective(null as unknown as StadiumTelemetry);
    expect(directive).toBeDefined();
    expect(directive.severity).toBe('LOW');
    expect(directive.telemetryId).toContain('Default-Stadium-Sector');
  });

  it('should sanitize malformed coordinates and fallback to defaults', async () => {
    const malformedTelemetry = {
      stadiumId: 'MetLife-NJ',
      anomalyDetected: true,
      coordinates: { x: 'invalid-x' as unknown as number, y: undefined as unknown as number }
    } as StadiumTelemetry;

    const directive = await processTelemetryAndGetDirective(malformedTelemetry);
    expect(directive).toBeDefined();
    expect(directive.explanation).toBeDefined();
    // Replaced coords should trigger default 0.50 display in explanation mock fallback
    expect(directive.explanation).toContain('0.50');
  });

  it('should handle normal telemetry and generate directive payload', async () => {
    const normalTelemetry: StadiumTelemetry = {
      stadiumId: 'MetLife-NJ',
      timestamp: new Date().toISOString(),
      crowdDensity: 0.4,
      spatialCongestionRatio: 0.3,
      noiseLevelDb: 60,
      anomalyDetected: false,
      anomalyDescription: 'Nominal flow',
      coordinates: { x: 0.2, y: 0.4 }
    };

    const directive = await processTelemetryAndGetDirective(normalTelemetry);
    expect(directive).toBeDefined();
    expect(directive.severity).toBe('LOW');
    expect(directive.targetGroup).toBeDefined();
    expect(directive.announcements.en).toContain('Welcome to the stadium');
  });
});
