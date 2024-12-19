'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { useToast } from '../../hooks/use-toast'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          description: 'E-posten din er lagt til i nyhetsbrevet 🎄',
        })
        setIsOpen(false)
        setEmail('')
      } else {
        toast({
          description: 'Kunne ikke legge til e-posten din i nyhetsbrevet. Vennligst prøv igjen senere.',
          variant: 'destructive',
        })
      }
    } catch (_error) {
      toast({
        description: 'Noe gikk galt. Vennligst prøv igjen senere.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="md:absolute md:right-4 md:top-12">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-[#D4B572] hover:bg-[#C1A465] text-black font-medium rounded-xl border-2 border-[#8B7B4B] shadow-md transform hover:scale-105 transition-transform duration-200 px-3 text-sm md:p-5 md:text-lg mb-2"
          >
            <Bell className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Meld deg på nyhetsbrev
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] sm:max-w-md bg-white border-gray-300 text-gray-800 sm:mx-3">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Meld deg på bekk.christmas nyhetsbrev</DialogTitle>
            <DialogDescription className="text-gray-600">
              Få varsel når neste års julekalender er klar 🎁
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="din@epost.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Button
              type="submit"
              className="w-full bg-[#D4B572] hover:bg-[#C1A465] text-black border-2 border-[#8B7B4B] font-bold
                     transform hover:scale-105 transition-transform duration-200"
            >
              Meld meg på
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
