import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Head>
        <title>PatternFly YAML Code Editor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@patternfly/patternfly@6.4.0/dist/css/patternfly.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@patternfly/patternfly@6.4.0/dist/css/patternfly-addons.css"
        />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/loader.min.js"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <Script src="/app.js" strategy="afterInteractive" type="module" />
      <div className="pf-v6-c-page">
        <div className="pf-v6-c-page__main-container">
          <main className="pf-v6-c-page__main themed-shell" tabIndex={-1} role="main">
            <section className="pf-v6-c-page__main-section hero">
              <div className="section-inner">
                <div className="hero-grid">
                  <div className="hero-copy">
                    <p className="eyebrow">PatternFly YAML playground</p>
                    <h1 className="pf-v6-c-title pf-m-3xl">LLM | InferenceService manifest editor</h1>
                    <p className="pf-v6-c-content--p pf-m-md">
                      Use the PatternFly code editor component to explore LLM|InferenceService YAML manifests.
                    </p>
                    <p className="control-description" id="resourceDescription">
                      Choose an InferenceService to view its YAML.
                    </p>
                  </div>
                  <div className="hero-controls">
                    <form className="pf-v6-c-form form-card minimal-controls" noValidate>
                      <div className="control-line">
                        <label htmlFor="inferenceServiceSelect" className="control-line__label">
                          InferenceService:
                        </label>
                        <select
                          className="pf-v6-c-form-control control-line__field"
                          id="inferenceServiceSelect"
                          defaultValue=""
                        >
                          <option value="" disabled hidden>
                            Loading services…
                          </option>
                        </select>
                      </div>
                      <div className="resource-selector-block">
                        <div id="llmResourceControls" hidden>
                          <div className="control-line">
                            <label htmlFor="cpuInput" className="control-line__label">
                              CPU (n):
                            </label>
                            <div className="pf-v6-c-number-input replica-control control-line__field">
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Decrease CPU"
                                data-resource-control="decrement"
                                data-resource="cpu"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M416 208H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
                                  </svg>
                                </span>
                              </button>
                              <div className="pf-v6-c-number-input__field">
                                <input
                                  className="pf-v6-c-form-control"
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  id="cpuInput"
                                  data-resource-input="cpu"
                                />
                              </div>
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Increase CPU"
                                data-resource-control="increment"
                                data-resource="cpu"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M432 256c0 17.7-14.3 32-32 32H256v144c0 17.7-14.3 32-32 32s-32-14.3-32-32V288H48c-17.7 0-32-14.3-32-32s14.3-32 32-32h144V80c0-17.7 14.3-32 32-32s32 14.3 32 32v144h144c17.7 0 32-14.3 32 32z" />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                          <div className="control-line">
                            <label htmlFor="memoryInput" className="control-line__label">
                              Memory (Gi):
                            </label>
                            <div className="pf-v6-c-number-input replica-control control-line__field">
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Decrease memory"
                                data-resource-control="decrement"
                                data-resource="memory"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M416 208H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
                                  </svg>
                                </span>
                              </button>
                              <div className="pf-v6-c-number-input__field">
                                <input
                                  className="pf-v6-c-form-control"
                                  type="number"
                                  step="1"
                                  min="1"
                                  id="memoryInput"
                                  data-resource-input="memory"
                                />
                              </div>
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Increase memory"
                                data-resource-control="increment"
                                data-resource="memory"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M432 256c0 17.7-14.3 32-32 32H256v144c0 17.7-14.3 32-32 32s-32-14.3-32-32V288H48c-17.7 0-32-14.3-32-32s14.3-32 32-32h144V80c0-17.7 14.3-32 32-32s32 14.3 32 32v144h144c17.7 0 32-14.3 32 32z" />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                          <div className="control-line">
                            <label htmlFor="gpuInput" className="control-line__label">
                              GPU (count):
                            </label>
                            <div className="pf-v6-c-number-input replica-control control-line__field">
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Decrease GPU"
                                data-resource-control="decrement"
                                data-resource="gpu"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M416 208H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
                                  </svg>
                                </span>
                              </button>
                              <div className="pf-v6-c-number-input__field">
                                <input
                                  className="pf-v6-c-form-control"
                                  type="number"
                                  step="1"
                                  min="0"
                                  id="gpuInput"
                                  data-resource-input="gpu"
                                />
                              </div>
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Increase GPU"
                                data-resource-control="increment"
                                data-resource="gpu"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M432 256c0 17.7-14.3 32-32 32H256v144c0 17.7-14.3 32-32 32s-32-14.3-32-32V288H48c-17.7 0-32-14.3-32-32s14.3-32 32-32h144V80c0-17.7 14.3-32 32-32s32 14.3 32 32v144h144c17.7 0 32-14.3 32 32z" />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                          <div className="control-line">
                            <label htmlFor="replicaInput" className="control-line__label">
                              Replicas:
                            </label>
                            <div className="pf-v6-c-number-input replica-control control-line__field">
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Minus"
                                data-replica-control="decrement"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M416 208H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
                                  </svg>
                                </span>
                              </button>
                              <div className="pf-v6-c-number-input__field">
                                <input
                                  className="pf-v6-c-form-control"
                                  type="number"
                                  id="replicaInput"
                                  min="1"
                                  step="1"
                                  defaultValue="1"
                                  aria-label="Replica count"
                                />
                              </div>
                              <button
                                className="pf-v6-c-button pf-m-control pf-m-icon"
                                type="button"
                                aria-label="Plus"
                                data-replica-control="increment"
                              >
                                <span className="pf-v6-c-button__icon" aria-hidden="true">
                                  <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                    <path d="M432 256c0 17.7-14.3 32-32 32H256v144c0 17.7-14.3 32-32 32s-32-14.3-32-32V288H48c-17.7 0-32-14.3-32-32s14.3-32 32-32h144V80c0-17.7 14.3-32 32-32s32 14.3 32 32v144h144c17.7 0 32-14.3 32 32z" />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="control-line">
                        <label htmlFor="resourceNameInput" className="control-line__label">
                          Name:
                        </label>
                        <input
                          className="pf-v6-c-form-control control-line__field"
                          type="text"
                          id="resourceNameInput"
                          placeholder="example"
                          autoComplete="off"
                          spellCheck="false"
                        />
                      </div>
                      <div className="control-line" id="modelControl" hidden>
                        <label htmlFor="modelSelect" className="control-line__label">
                          Model:
                        </label>
                        <select className="pf-v6-c-form-control control-line__field" id="modelSelect" defaultValue="">
                          <option value="" disabled hidden>
                            Select a model…
                          </option>
                        </select>
                      </div>
                      <div className="tool-toggle" id="toolControl" hidden>
                        <span className="control-line__label">Enable Tool Calling:</span>
                        <label className="tool-toggle__option">
                          <input type="radio" name="toolCalling" value="on" />{' '}
                          <span>On</span>
                        </label>
                        <label className="tool-toggle__option">
                          <input type="radio" name="toolCalling" value="off" defaultChecked />{' '}
                          <span>Off</span>
                        </label>
                      </div>
                      <p className="control-description" id="modelDescription" hidden>
                        Applies the selected model’s <code>spec.model</code> settings for <code>LLMInferenceService</code>.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            <section className="pf-v6-c-page__main-section content-section">
              <div className="section-inner">
                <div className="editor-frame">
                  <div className="pf-v6-c-code-editor pf-m-full-height" id="codeEditor">
                    <div className="pf-v6-c-code-editor__header">
                      <div className="pf-v6-c-code-editor__header-content">
                        <div className="pf-v6-c-code-editor__header-main">
                          <div className="pf-v6-c-code-editor__tab">
                            <span className="pf-v6-c-code-editor__tab-icon">
                              <span className="pf-v6-c-label pf-m-purple" id="resourceBadge">
                                <span className="pf-v6-c-label__content">YAML</span>
                              </span>
                            </span>
                            <div className="editor-title-wrapper">
                              <span className="pf-v6-c-code-editor__tab-text" id="editorTitle">
                                InferenceService manifest
                              </span>
                              <span className="pf-v6-c-label" id="modelValidationBadge" hidden>
                                <span className="pf-v6-c-label__content" />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="pf-v6-c-code-editor__controls editor-controls">
                          <button className="pf-v6-c-button pf-m-control pf-m-plain" type="button" id="copyButton">
                            <span className="pf-v6-c-button__icon pf-m-start" aria-hidden="true">
                              <svg className="pf-v6-svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                <path d="M320 0H96C60.7 0 32 28.7 32 64v288h64V64h224V0zm32 96H160c-35.3 0-64 28.7-64 64v288c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64zm0 352H160V160h192v288z" />
                              </svg>
                            </span>
                            <span className="pf-v6-c-button__text">Copy YAML</span>
                          </button>
                          <div className="pf-v6-c-helper-text pf-m-inline copy-status" data-state="idle" id="copyStatusWrapper">
                            <div className="pf-v6-c-helper-text__item">
                              <span className="pf-v6-c-helper-text__item-text" id="copyStatus" aria-live="polite" />
                            </div>
                          </div>
                          <div className="shortcuts-trigger">
                            <button
                              className="pf-v6-c-button pf-m-link pf-m-inline"
                              type="button"
                              id="shortcutsToggle"
                              aria-controls="shortcutsPanel"
                              aria-expanded="false"
                            >
                              <span className="pf-v6-c-button__icon pf-m-start" aria-hidden="true">
                                <svg className="pf-v6-svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                                  <path d="M80 32C35.8 32 0 67.8 0 112v288c0 44.2 35.8 80 80 80h352c44.2 0 80-35.8 80-80V112c0-44.2-35.8-80-80-80H80zm0 64h352c8.8 0 16 7.2 16 16v224H64V112c0-8.8 7.2-16 16-16zm96 288h160c0 17.7-14.3 32-32 32h-96c-17.7 0-32-14.3-32-32z" />
                                </svg>
                              </span>
                              <span className="pf-v6-c-button__text">View shortcuts</span>
                            </button>
                            <div className="pf-v6-c-popover pf-m-right shortcuts-panel" role="dialog" id="shortcutsPanel" hidden>
                              <div className="pf-v6-c-popover__arrow" />
                              <div className="pf-v6-c-popover__content">
                                <p className="pf-v6-c-title pf-m-md">PC shortcuts</p>
                                <ul className="shortcut-list">
                                  <li>
                                    <span>Ctrl</span> + <span>F</span> <em>Find</em>
                                  </li>
                                  <li>
                                    <span>Ctrl</span> + <span>H</span> <em>Replace</em>
                                  </li>
                                  <li>
                                    <span>Ctrl</span> + <span>/</span> <em>Toggle comment</em>
                                  </li>
                                </ul>
                                <p className="pf-v6-c-title pf-m-md pf-v6-u-mt-md">Mac shortcuts</p>
                                <ul className="shortcut-list">
                                  <li>
                                    <span>⌘</span> + <span>F</span> <em>Find</em>
                                  </li>
                                  <li>
                                    <span>⌘</span> + <span>H</span> <em>Replace</em>
                                  </li>
                                  <li>
                                    <span>⌘</span> + <span>/</span> <em>Toggle comment</em>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pf-v6-c-code-editor__main">
                      <div className="pf-v6-c-code-editor__code">
                        <div id="editor" className="code-editor__monaco" role="presentation" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

