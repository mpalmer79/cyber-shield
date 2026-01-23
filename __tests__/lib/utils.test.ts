import {
  cn,
  formatDate,
  formatTimeElapsed,
  formatDuration,
  calculatePercentage,
  generateId,
  truncate,
  getDifficultyColor,
  getThreatColor,
  getStatusBadgeClass,
  calculateXP,
  getLevelTitle,
  shuffleArray,
  parseDomain,
  analyzeSuspiciousURL,
  sanitizeInput,
  formatScoreWithGrade,
} from '@/lib/utils';

describe('cn (className merger)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo');
  });
});

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toMatch(/Jan 15, 2024/);
  });

  it('should format date string', () => {
    expect(formatDate('2024-06-20')).toMatch(/Jun 20, 2024/);
  });
});

describe('formatTimeElapsed', () => {
  it('should format elapsed time correctly', () => {
    const startTime = new Date(Date.now() - 125000); // 2 minutes 5 seconds ago
    const result = formatTimeElapsed(startTime);
    expect(result).toBe('2:05');
  });

  it('should handle zero seconds', () => {
    const startTime = new Date(Date.now() - 60000); // 1 minute ago
    const result = formatTimeElapsed(startTime);
    expect(result).toBe('1:00');
  });
});

describe('formatDuration', () => {
  it('should format minutes only', () => {
    expect(formatDuration(45)).toBe('45 min');
  });

  it('should format hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('should format exact hours', () => {
    expect(formatDuration(120)).toBe('2h');
  });
});

describe('calculatePercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(1, 4)).toBe(25);
  });

  it('should handle zero total', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  it('should round to nearest integer', () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    expect(id1).not.toBe(id2);
  });

  it('should include prefix', () => {
    const id = generateId('module');
    expect(id.startsWith('module-')).toBe(true);
  });

  it('should use default prefix', () => {
    const id = generateId();
    expect(id.startsWith('id-')).toBe(true);
  });
});

describe('truncate', () => {
  it('should truncate long text', () => {
    const text = 'This is a very long text that needs truncation';
    expect(truncate(text, 20)).toBe('This is a very lo...');
  });

  it('should not truncate short text', () => {
    const text = 'Short';
    expect(truncate(text, 20)).toBe('Short');
  });

  it('should handle exact length', () => {
    const text = 'Exact';
    expect(truncate(text, 5)).toBe('Exact');
  });
});

describe('getDifficultyColor', () => {
  it('should return correct colors for each difficulty', () => {
    expect(getDifficultyColor('beginner')).toBe('text-green-400');
    expect(getDifficultyColor('intermediate')).toBe('text-yellow-400');
    expect(getDifficultyColor('advanced')).toBe('text-orange-400');
    expect(getDifficultyColor('expert')).toBe('text-red-400');
  });

  it('should return gray for unknown difficulty', () => {
    expect(getDifficultyColor('unknown')).toBe('text-gray-400');
  });
});

describe('getThreatColor', () => {
  it('should return correct colors for each threat level', () => {
    expect(getThreatColor('critical')).toBe('text-red-500');
    expect(getThreatColor('high')).toBe('text-orange-500');
    expect(getThreatColor('medium')).toBe('text-yellow-500');
    expect(getThreatColor('low')).toBe('text-green-500');
    expect(getThreatColor('info')).toBe('text-blue-500');
  });

  it('should return gray for unknown level', () => {
    expect(getThreatColor('unknown')).toBe('text-gray-500');
  });
});

describe('getStatusBadgeClass', () => {
  it('should return correct classes for each status', () => {
    expect(getStatusBadgeClass('locked')).toContain('gray');
    expect(getStatusBadgeClass('available')).toContain('cyber');
    expect(getStatusBadgeClass('in-progress')).toContain('yellow');
    expect(getStatusBadgeClass('completed')).toContain('green');
  });

  it('should return empty string for unknown status', () => {
    expect(getStatusBadgeClass('unknown')).toBe('');
  });
});

describe('calculateXP', () => {
  it('should calculate XP with difficulty multiplier', () => {
    expect(calculateXP(100, 'beginner')).toBe(100);
    expect(calculateXP(100, 'intermediate')).toBe(150);
    expect(calculateXP(100, 'advanced')).toBe(200);
    expect(calculateXP(100, 'expert')).toBe(300);
  });

  it('should use default multiplier for unknown difficulty', () => {
    expect(calculateXP(100, 'unknown')).toBe(100);
  });
});

describe('getLevelTitle', () => {
  it('should return correct titles for each level', () => {
    expect(getLevelTitle(1)).toBe('Security Novice');
    expect(getLevelTitle(5)).toBe('Security Guardian');
    expect(getLevelTitle(10)).toBe('Security Legend');
  });

  it('should return Legend for levels above 10', () => {
    expect(getLevelTitle(15)).toBe('Security Legend');
  });
});

describe('shuffleArray', () => {
  it('should return array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled.length).toBe(arr.length);
  });

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    arr.forEach((item) => {
      expect(shuffled).toContain(item);
    });
  });

  it('should not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(original);
  });
});

describe('parseDomain', () => {
  it('should extract domain from email', () => {
    expect(parseDomain('user@example.com')).toBe('example.com');
    expect(parseDomain('test@subdomain.company.org')).toBe('subdomain.company.org');
  });

  it('should return empty string for invalid email', () => {
    expect(parseDomain('invalid')).toBe('');
  });
});

describe('analyzeSuspiciousURL', () => {
  it('should detect IP address URLs', () => {
    const flags = analyzeSuspiciousURL('http://192.168.1.1/login');
    expect(flags).toContain('Uses IP address instead of domain name');
  });

  it('should detect URL shorteners', () => {
    const flags = analyzeSuspiciousURL('https://bit.ly/abc123');
    expect(flags).toContain('Uses URL shortener to hide destination');
  });

  it('should detect suspicious TLDs', () => {
    const flags = analyzeSuspiciousURL('https://example.xyz');
    expect(flags).toContain('Uses uncommon/suspicious TLD');
  });

  it('should detect excessive subdomains', () => {
    const flags = analyzeSuspiciousURL('https://a.b.c.d.example.com');
    expect(flags).toContain('Excessive subdomains');
  });

  it('should return empty array for clean URLs', () => {
    const flags = analyzeSuspiciousURL('https://google.com');
    expect(flags.length).toBe(0);
  });
});

describe('sanitizeInput', () => {
  it('should escape HTML characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('should escape single quotes', () => {
    expect(sanitizeInput("It's a test")).toBe("It&#039;s a test");
  });
});

describe('formatScoreWithGrade', () => {
  it('should return A for 90+', () => {
    const result = formatScoreWithGrade(95);
    expect(result.grade).toBe('A');
    expect(result.color).toBe('text-green-400');
  });

  it('should return B for 80-89', () => {
    const result = formatScoreWithGrade(85);
    expect(result.grade).toBe('B');
    expect(result.color).toBe('text-cyber-400');
  });

  it('should return C for 70-79', () => {
    const result = formatScoreWithGrade(75);
    expect(result.grade).toBe('C');
    expect(result.color).toBe('text-yellow-400');
  });

  it('should return D for 60-69', () => {
    const result = formatScoreWithGrade(65);
    expect(result.grade).toBe('D');
    expect(result.color).toBe('text-orange-400');
  });

  it('should return F for below 60', () => {
    const result = formatScoreWithGrade(55);
    expect(result.grade).toBe('F');
    expect(result.color).toBe('text-red-400');
  });
});
