export function formatHTML(index: number, data: object) {
  let string = '<td colspan="4" class="content">'
  let gmap_link = data[index].gmap_link

  if (!data[index].gmap_link) {
    gmap_link = `https://www.google.com/maps/place/${data[index].location.lat},${data[index].location.long}`
  }

  string += `
  <a href=${gmap_link} target="_blank" rel="noopener noreferrer" class="flex items-center underline underline-offset-2 text-sm sm:text-md hover:text-[--dark-text-secondary-color-hover]">Open map for directions
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6.4 18L5 16.6L14.6 7H6V5h12v12h-2V8.4z"/></svg>
  </a>`

  string += `</td>`

  return string
}

export function injectContent(activeRow, index, event, data) {
  const expandableRow = event.currentTarget
  let expandedContent = expandableRow.nextElementSibling

  // Remove any existing expanded content if it's not the current row
  if (activeRow.value && activeRow.value !== expandableRow) {
    const previousExpandedContent = activeRow.value.nextElementSibling
    if (
      previousExpandedContent
      && previousExpandedContent.classList.contains('expanded-content')
    ) {
      previousExpandedContent.classList.add('slide-up')
      setTimeout(() => previousExpandedContent.remove(), 150)
      activeRow.value.classList.remove('selected-row')
    }
  }

  if (
    expandedContent
    && expandedContent.classList.contains('expanded-content')
  ) {
    // Toggle existing expanded content
    expandedContent.classList.add('slide-up')
    setTimeout(() => expandedContent.remove(), 150)
    activeRow.value.classList.remove('selected-row')
    activeRow.value = null
  }
  else {
    // Inject new expanded content
    expandedContent = document.createElement('tr')
    expandedContent.classList.add('expanded-content')
    expandedContent.innerHTML = formatHTML(index, data)
    expandableRow.parentNode.insertBefore(
      expandedContent,
      expandableRow.nextSibling
    )
    expandableRow.classList.add('selected-row')
    expandedContent.style.display = 'none'
    setTimeout(() => {
      expandedContent.style.display = 'table-row'
      expandedContent.classList.add('slide-down')
    }, 0)
    activeRow.value = expandableRow
  }
}

export function handleFocusOut(activeRow, event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    // Remove all expanded content when focus is lost from the table
    const expandedContents = document.querySelectorAll('.expanded-content')
    expandedContents.forEach((content) => {
      setTimeout(() => content.remove(), 150)
      content.classList.add('slide-up')
    })
    if (activeRow.value) {
      activeRow.value.classList.remove('selected-row')
    }
    activeRow.value = null
  }
}
