import { createI18n } from './context'

describe('context', () => {
  it('should create i18n', () => {
    const i18n = createI18n({
      en: {
        'select-template': 'Select a template: {0} {1}',
      },
    }, 'en')

    expect(i18n.t('select-template', ['foo', 'bar'])).toBe('Select a template: foo bar')
  })
})
