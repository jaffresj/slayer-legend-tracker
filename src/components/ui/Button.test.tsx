import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('rend son contenu et a le type "button" par défaut', () => {
    render(<Button>Enregistrer</Button>)
    const button = screen.getByRole('button', { name: 'Enregistrer' })
    expect(button).toHaveAttribute('type', 'button')
  })

  it('déclenche onClick au clic', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>OK</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('ne déclenche pas onClick quand désactivé', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        OK
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
