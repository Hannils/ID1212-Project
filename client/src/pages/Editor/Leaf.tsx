import { styled } from '@mui/material'
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'
import React, { useRef } from 'react'
import { RenderLeafProps, useSlateWithV } from 'slate-react'

interface CollaboratorTooltipProps extends TooltipProps {
  color: string
}

const CollaboratorTooltip = styled(
  ({ className, ...props }: CollaboratorTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
)(({ theme, color }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: color,
    borderColor: color,
    color: 'white',
    padding: 2,
    marginTop: 6,
    marginBottom: 6,
    height: 10,
    lineHeight: '10px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color,
  },
}))

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.collaborator) {
    children = (
      <CollaboratorTooltip
        title={leaf.collaborator.displayName}
        open={true}
        arrow={true}
        color={leaf.collaborator.color}
      >
        <span style={{ backgroundColor: leaf.collaborator.color }}>
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              width: '1px',
              height: '100%',
              backgroundColor: leaf.collaborator.color,
            }}
          />
          {children}
        </span>
      </CollaboratorTooltip>
    )
  }

  return <span {...attributes}>{children}</span>
}

export default Leaf
