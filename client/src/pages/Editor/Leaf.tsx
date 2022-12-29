import React from 'react'
import { RenderLeafProps } from 'slate-react'

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.collaborator) {
    children = <span style={{ backgroundColor: 'red' }}>{children}</span>
  }

  return <span {...attributes}>{children}</span>
}

export default Leaf
