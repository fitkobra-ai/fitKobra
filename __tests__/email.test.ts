import { getWelcomeEmailTemplate } from '../services/email';

describe('Email Service', () => {
  it('generates welcome email HTML with user name and branding', () => {
    const userName = 'Alex';
    const html = getWelcomeEmailTemplate(userName);
    
    expect(html).toContain('Welcome to FitKobra, Alex!');
    expect(html).toContain('FitKobra AI');
    expect(html).toContain('+10 AI Credits');
  });
});
