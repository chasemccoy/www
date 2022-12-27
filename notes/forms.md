---
title: Forms
excerpt: Forms are one of the core patterns of the web, and enable the interactivity that users expect from a web application.
tags:
  - design
---

## Takeaways from [_Form Design Patterns_ by Adam Silver](https://www.smashingmagazine.com/printed-books/form-design-patterns/)

<book-mark url='https://www.smashingmagazine.com/printed-books/form-design-patterns/'></book-mark>

### Labels

From [Accessibility for Everyone by Laura Kalbag](https://abookapart.com/products/accessibility-for-everyone), four parameters that improve user experiences for everyone:

- Visual: make it easy to see
- Auditory: make it easy to hear
- Motor: make it easy to interact with
- Cognitive: make it easy to understand

Labels are one of the most important aspects of forms because of the way they serve these parameters.

> By looking at labels from each of these standpoints, we can see just how important labels are. Sighted users can read them, visually-impaired users can hear them by using a screen reader, and motor-impaired users can more easily set focus to the field thanks to the larger hit area.

Every form control _that accepts input_ should have a label. Things like submit buttons that don't accept input don't need a label (as long as they have text within them).

### Placeholders

Placeholder text is optional and always a nice-to-have. Any information that the user needs to fill in the form correctly should be text on the page (ideally below the label).

Example of this for a password field:

```html
<div class="field">
  <label for="password">
    <span class="field-label">Password</span>
    <span class="field-hint"
      >Must contain 8+ characters with at least 1 number and 1 uppercase
      letter.</span
    >
  </label>
  <input type="password" id="password" name="password" />
</div>
```

### Question protocols

<book-mark url='https://www.uxmatters.com/mt/archives/2010/06/the-question-protocol-how-to-make-sure-every-form-field-is-necessary.php'></book-mark>

### Password fields

Add a button for password reveals so that you don't have to add a second password confirmation input and your users can still check their password before they submit the form.
