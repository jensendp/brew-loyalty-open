import { EventBus } from '../EventBus'

describe('EventBus', () => {
  let bus: EventBus

  beforeEach(() => {
    bus = new EventBus()
  })

  it('delivers an event to a subscribed handler', () => {
    const handler = jest.fn()
    bus.on('points.earned', handler)
    bus.emit('points.earned', { enrollmentId: 'e1', amount: 50, reason: 'purchase' })
    expect(handler).toHaveBeenCalledWith({ enrollmentId: 'e1', amount: 50, reason: 'purchase' })
  })

  it('delivers to multiple handlers for the same event', () => {
    const h1 = jest.fn()
    const h2 = jest.fn()
    bus.on('member.signed_in', h1)
    bus.on('member.signed_in', h2)
    bus.emit('member.signed_in', { userId: 'u1', email: 'a@b.com' })
    expect(h1).toHaveBeenCalledTimes(1)
    expect(h2).toHaveBeenCalledTimes(1)
  })

  it('does not deliver to handlers of a different event', () => {
    const handler = jest.fn()
    bus.on('points.earned', handler)
    bus.emit('member.signed_in', { userId: 'u1', email: null })
    expect(handler).not.toHaveBeenCalled()
  })

  it('unsubscribes correctly', () => {
    const handler = jest.fn()
    const unsub = bus.on('points.earned', handler)
    unsub()
    bus.emit('points.earned', { enrollmentId: 'e1', amount: 10, reason: 'visit' })
    expect(handler).not.toHaveBeenCalled()
  })

  it('once() fires exactly once then auto-unsubscribes', () => {
    const handler = jest.fn()
    bus.once('reward.redeemed', handler)
    bus.emit('reward.redeemed', { enrollmentId: 'e1', rewardId: 'r1', rewardName: 'Free Pint' })
    bus.emit('reward.redeemed', { enrollmentId: 'e1', rewardId: 'r1', rewardName: 'Free Pint' })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not throw when emitting to an event with no subscribers', () => {
    expect(() =>
      bus.emit('tier.changed', {
        enrollmentId: 'e1',
        previousTierId: null,
        newTierId: 't1',
        newTierName: 'Gold',
      })
    ).not.toThrow()
  })

  it('isolates errors in one handler from others', () => {
    const bad = jest.fn().mockImplementation(() => { throw new Error('boom') })
    const good = jest.fn()
    bus.on('member.enrolled', bad)
    bus.on('member.enrolled', good)
    bus.emit('member.enrolled', { memberId: 'm1', programId: 'p1', orgId: 'o1' })
    expect(good).toHaveBeenCalledTimes(1)
  })
})
