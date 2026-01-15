import fs from 'fs-extra';
import path from 'path';
import { printInfo, printSuccess } from './utils/branding.js';

export type TestFramework = 'jest' | 'vitest';

export async function setupTestFramework(
    targetDir: string,
    framework: TestFramework,
    language: 'ts' | 'js'
): Promise<void> {
    if (framework === 'jest') {
        await setupJest(targetDir, language);
    } else if (framework === 'vitest') {
        await setupVitest(targetDir, language);
    }
}

async function setupJest(targetDir: string, language: 'ts' | 'js'): Promise<void> {
    // Jest config
    const jestConfig = language === 'ts' ? `export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
};` : `export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
  ],
};`;

    await fs.writeFile(
        path.join(targetDir, language === 'ts' ? 'jest.config.ts' : 'jest.config.js'),
        jestConfig
    );

    // Sample test file
    const sampleTest = language === 'ts' ? `import { describe, it, expect } from '@jest/globals';

describe('Sample Test Suite', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });
});` : `describe('Sample Test Suite', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });
});`;

    const testsDir = path.join(targetDir, 'src', '__tests__');
    await fs.ensureDir(testsDir);
    await fs.writeFile(
        path.join(testsDir, `sample.test.${language}`),
        sampleTest
    );

    // Update package.json
    await updatePackageJsonForTesting(targetDir, 'jest', language);

    printSuccess('Jest testing framework configured');
}

async function setupVitest(targetDir: string, language: 'ts' | 'js'): Promise<void> {
    // Vitest config
    const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.{js,ts}',
        '**/__tests__/**',
      ],
    },
  },
});`;

    await fs.writeFile(
        path.join(targetDir, 'vitest.config.ts'),
        vitestConfig
    );

    // Sample test file
    const sampleTest = language === 'ts' ? `import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });
});` : `import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });
});`;

    const testsDir = path.join(targetDir, 'src', '__tests__');
    await fs.ensureDir(testsDir);
    await fs.writeFile(
        path.join(testsDir, `sample.test.${language}`),
        sampleTest
    );

    // Update package.json
    await updatePackageJsonForTesting(targetDir, 'vitest', language);

    printSuccess('Vitest testing framework configured');
}

async function updatePackageJsonForTesting(
    targetDir: string,
    framework: TestFramework,
    language: 'ts' | 'js'
): Promise<void> {
    const pkgPath = path.join(targetDir, 'package.json');
    
    if (!await fs.pathExists(pkgPath)) {
        return;
    }

    const pkg = await fs.readJson(pkgPath);

    if (framework === 'jest') {
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.test = 'jest';
        pkg.scripts['test:watch'] = 'jest --watch';
        pkg.scripts['test:coverage'] = 'jest --coverage';

        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies.jest = '^29.7.0';
        
        if (language === 'ts') {
            pkg.devDependencies['ts-jest'] = '^29.1.1';
            pkg.devDependencies['@types/jest'] = '^29.5.11';
        }
        
        pkg.devDependencies['@jest/globals'] = '^29.7.0';
    } else if (framework === 'vitest') {
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.test = 'vitest run';
        pkg.scripts['test:watch'] = 'vitest';
        pkg.scripts['test:coverage'] = 'vitest run --coverage';

        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies.vitest = '^1.1.0';
        pkg.devDependencies['@vitest/coverage-v8'] = '^1.1.0';
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    printInfo('package.json updated with test scripts');
}

export async function setupTestingFiles(
    targetDir: string,
    framework: TestFramework,
    language: 'ts' | 'js'
): Promise<void> {
    await setupTestFramework(targetDir, framework, language);
}
