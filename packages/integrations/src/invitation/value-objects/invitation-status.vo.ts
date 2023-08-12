import { ValueObject } from '@undb/domain'
import { None, Some, type Option } from 'oxide.ts'
import { z } from 'zod'
import type { InvitationSpecification } from '../interface'
import { WithInvitationStatus } from '../specifications'

export const invitationStatus = z.enum(['active', 'cancelled', 'accepted'])

export type IInvitationStatus = z.infer<typeof invitationStatus>

export class InvitationStatus extends ValueObject<IInvitationStatus> {
  public value() {
    return this.unpack()
  }

  static fromString(status: string) {
    return new this({ value: invitationStatus.parse(status) })
  }

  public activate(): Option<InvitationSpecification> {
    if (this.unpack() === 'active') {
      return None
    }
    const status = new InvitationStatus({ value: 'active' })
    return Some(new WithInvitationStatus(status))
  }

  public cancel(): Option<InvitationSpecification> {
    if (this.unpack() === 'cancelled') {
      return None
    }
    const status = new InvitationStatus({ value: 'cancelled' })
    return Some(new WithInvitationStatus(status))
  }

  public accept(): Option<InvitationSpecification> {
    if (this.unpack() === 'accepted') {
      return None
    }

    const status = new InvitationStatus({ value: 'accepted' })
    return Some(new WithInvitationStatus(status))
  }
}
