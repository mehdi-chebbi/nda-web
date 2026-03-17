interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', disabled = false }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-body font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-white hover:bg-secondary-light shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
