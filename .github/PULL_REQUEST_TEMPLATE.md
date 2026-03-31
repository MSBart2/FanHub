# 🧪 Say My Name (and what this PR does)

> _"I am the one who ships."_
>
> Describe what changed and why. Not the how — we can read the diff. The **why**.
> "Fixed a bug" will result in your PR being dissolved in a barrel of hydrofluoric acid.

---

## 🔬 Type of Change

What kind of cook is this?

- [ ] 🐛 **Bug fix** — something was broken and now it's less broken
- [ ] ✨ **New feature** — Gus Fring would call this "professional"
- [ ] 🔒 **Security fix** — because MD5 is not a personality
- [ ] ♻️ **Refactor** — same blue, higher purity
- [ ] 📖 **Docs** — someone actually read the docs, bless you
- [ ] 🧪 **Tests** — _"Yeah science!"_ (Aaron Paul voice)
- [ ] 💀 **Breaking change** — you better have a plan, Heisenberg

---

## 🪲 The Bug (if applicable)

> Which known bug from `dotnet/BUGS.md` does this fix? Link the line.
> If it's not in the catalog, add it first so we know what we're dealing with.
> Bonus points if you fixed it without looking at the doc. Zero points if you introduced it.

**Bug ref:**

---

## ⚗️ How Was This Tested?

Be honest. The blue stuff doesn't lie.

- [ ] Backend runs without immediately throwing a `NullReferenceException` at me
- [ ] Frontend loads and doesn't render two Jesse Pinkmans
- [ ] I clicked the thing. The thing worked.
- [ ] I wrote a real test. An _actual_ test. With assertions. Like a professional.
- [ ] I stared at it, squinted, and felt good about myself
- [ ] Hank from the DEA reviewed it and didn't notice anything

---

## ✅ The Heisenberg Checklist

Do NOT submit this PR until you can check every box that applies to your change.
_We do not ship 96% purity. Not here._

**Code quality:**

- [ ] It compiles. The bar is on the floor. Step over it.
- [ ] I did not use `var` where the type is genuinely unknowable to the human eye
- [ ] I removed my debug `Console.WriteLine("HERE")` statements (we've all done it)

**The classics (you know what you did):**

- [ ] I awaited `SaveChangesAsync()`. Every. Single. Call.
- [ ] New POST endpoints return `201 Created`, not `200 OK` like some kind of animal
- [ ] I added a null check after `FindAsync()`. Yes, even that one.
- [ ] I did not use MD5 for passwords. Or SHA1. Or storing them in plaintext. I am not a villain.
- [ ] I did not add a second Jesse Pinkman to the seed data
- [ ] The hardcoded connection string situation is no worse than I found it

**Security:**

- [ ] CORS is not more permissive than before (`AllowAnyOrigin` has caused enough damage)
- [ ] I am not returning password hashes to the client
- [ ] I have not introduced a new hardcoded secret into source code

**Frontend:**

- [ ] The homepage stat counts still work
- [ ] The season filter still filters (or is still broken — but not newly broken)
- [ ] I unsubscribed from any events I subscribed to (`IDisposable`, please)

---

## 📸 Screenshots

> If the UI changed, show us before and after.
> If you didn't change the UI, delete this section.
> If you changed the UI and have no screenshots, explain yourself.

| Before | After |
| ------ | ----- |
|        |       |

---

## 💬 Anything Else?

> What should reviewers know? What are you nervous about? What are you proud of?
> What would Walter White say about this code?
>
> _"This PR is not in danger. This PR IS the danger."_
