import React from 'react';

type Props = {
  onClick: () => void;
  opening: boolean;
  disabled?: boolean;
  label?: string;
};

export function BookButton(props: Props) {
  return (
    <button
      type="button"
      className={'book-btn' + (props.opening ? ' opening' : '')}
      onClick={props.onClick}
      disabled={!!props.disabled}
      aria-label={props.label || "Generate today's poem"}
      aria-pressed={props.opening ? 'true' : 'false'}
    >
      <div className="book-btn-inner">
        <div className="book-cover" />
        <div className="book-spine" />
        <div className="book-edge" />
        <div className="book-label">Generate</div>
      </div>
    </button>
  );
}

export default BookButton;
