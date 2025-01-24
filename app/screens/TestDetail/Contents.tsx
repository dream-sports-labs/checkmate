import {InputLabels} from '../TestList/InputLabels'

export const TextContent = ({
  data,
  heading,
}: {
  data: string | undefined
  heading: string
}) => {
  const infoTextStyle = {fontSize: 14, color: 'rgb(31 41 55)', paddingTop: 2}

  const urlRegex = /(https?:\/\/[^\s]+)/g
  return (
    data && (
      <div className="flex flex-col w-full gap-1.5 text-sm">
        <InputLabels labelName={heading} />
        <div
          style={{
            resize: 'vertical',
            overflowY: 'auto',
            border: '1px solid rgb(0 0 0 / 10%)',
            padding: '8px',
            borderRadius: '4px',
            minHeight: '48px',
            height: 'calc(100vh / 11)',
            boxSizing: 'border-box',
            ...infoTextStyle,
          }}
          className="custom-resizable">
          {data
            .replace(/\\n/g, '\n')
            .split('\n')
            .map((line, index) => (
              <p key={index}>
                {line.split(urlRegex).map((part, i) =>
                  urlRegex.test(part) ? (
                    <a
                      key={i}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline">
                      {part}
                    </a>
                  ) : (
                    part
                  ),
                )}
              </p>
            ))}
        </div>
      </div>
    )
  )
}

export const OptionContent = ({
  data,
  heading,
}: {
  data: string | undefined
  heading: string
}) => {
  const infoTextStyle = {fontSize: 14, color: 'rgb(31 41 55)', paddingTop: 2}
  return (
    data && (
      <div className="min-w-60">
        <InputLabels labelName={heading} />
        <div style={infoTextStyle}>{data}</div>
      </div>
    )
  )
}

export const LinkContent = ({
  data,
  heading,
}: {
  data: string | undefined
  heading: string
}) => {
  const infoTextStyle = {fontSize: 14, color: 'rgb(37 99 235)', paddingTop: 9}
  return (
    data && (
      <div className="flex flex-col">
        <InputLabels labelName={heading} />
        <a
          style={{...infoTextStyle}}
          href={data}
          target="_blank"
          rel="noopener noreferrer">
          {data}
        </a>
      </div>
    )
  )
}
