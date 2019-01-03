const nodeBuilder = require('@now/node')
const microBuilder = require('now-micro')

describe('now-micro', () => {
  it('should re-export @now/node builder implementation', () => {
    expect(microBuilder.config).toBe(nodeBuilder.config)
    expect(microBuilder.prepareCache).toBe(nodeBuilder.prepareCache)
  })
})
