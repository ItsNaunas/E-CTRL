import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    test('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    test('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    test('should handle undefined and null values', () => {
      expect(cn('base', undefined, null)).toBe('base')
    })

    test('should merge conflicting Tailwind classes', () => {
      expect(cn('px-2 px-4')).toBe('px-4') // Last one wins
      expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500')
    })

    test('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    test('should handle objects with boolean values', () => {
      expect(cn({
        'class1': true,
        'class2': false,
        'class3': true
      })).toBe('class1 class3')
    })

    test('should handle complex combinations', () => {
      const result = cn(
        'base-class',
        ['array-class1', 'array-class2'],
        {
          'conditional-class': true,
          'hidden-class': false
        },
        'final-class'
      )
      expect(result).toBe('base-class array-class1 array-class2 conditional-class final-class')
    })
  })
})
