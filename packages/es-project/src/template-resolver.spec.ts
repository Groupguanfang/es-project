import { fetchTemplate, fetchTemplates } from './template-resolver'

describe('template resolver', () => {
  it('should fetch templates', async () => {
    const templates = await fetchTemplates()

    expect(templates).toBeDefined()
    expect(templates.length).toBeGreaterThan(0)
  })

  it('should fetch template', async () => {
    const template = await fetchTemplate('vue')

    console.dir(template, { depth: null })

    expect(template).toBeDefined()
  })
})
