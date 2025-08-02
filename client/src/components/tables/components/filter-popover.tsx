import { cn } from '~/helpers'

import { CheckIcon } from 'lucide-react'

import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui'

type FilterPopoverProps = {
	title: string
	uniqueValues: string[]
	selectedValues: Set<string>
	onSelect: (value: string) => void
	onReset: () => void
	placeholder?: string
	facets?: Map<string, number>
}

export function FilterPopover({
	title,
	uniqueValues,
	selectedValues,
	onSelect,
	onReset,
	placeholder = `Sök ${title}...`,
	facets,
}: FilterPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button
					size={'sm'}
					className={cn(
						selectedValues.size > 0 &&
							'border-secondary border border-dashed bg-transparent',
						'',
					)}
				>
					{title}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0' align='start'>
				<Command>
					<CommandInput placeholder={placeholder} />
					<CommandList>
						<CommandEmpty>No results.</CommandEmpty>
						<CommandGroup>
							{uniqueValues.map((option) => {
								const isSelected = selectedValues.has(option)
								return (
									<CommandItem
										key={option}
										onSelect={() => {
											onSelect(option)
										}}
									>
										<div
											className={cn(
												'mr-2 flex size-5 items-center justify-center rounded-sm border border-indigo-300',
												isSelected ?
													'text-primary-foreground bg-indigo-200'
												:	'opacity-50 [&_svg]:invisible',
											)}
										>
											<CheckIcon
												className={cn('size-4')}
											/>
										</div>
										<span>{option}</span>
										{facets?.get(option) && (
											<span className='ml-auto flex size-4 items-center justify-center font-mono text-xs'>
												{facets.get(option)}
											</span>
										)}
									</CommandItem>
								)
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={onReset}
										className='justify-center text-center'
									>
										Reset filter
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
