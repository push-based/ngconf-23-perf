# User Flow - user-flow CLI Exercise

We've already learned how to create simple user flows manually with the `lighthouse` tool as well
as with the `recorder` tool. Let's combine our knowledge and step up the game a bit.
In this exercise we will create a more complex scenario resembling a user flow through the
movies application which could be used as a real world audit as well.

You will combine the `lighthouse` measurement modes to a cohesive user flow by using
the `@push-based/user-flow` package to create a `nodejs` script which should perform an automated
audit of your application. For this, we will also re-use the `recorder` tool from before.

We will create the recordings on our locally served application, for this
make sure to run `npm run start`.

## Full User Flow Description

In the next couple of steps you will create audits for a full user flow.
It will contain an initial `navigation` report, three `timespan` reports and two `snapshot`
reports, together resembling a cohesive `user flow`.

<details>
  <summary>Final Result</summary>

![uf-final-audit](images/user-flow/lh-uf-final-audit.png)

</details>

The flow describes how a user lands on the `Popular Movies` page, navigates to
`Top Rated Movies`, starts a search and navigates to a detail page.

Below you find a more detailed description of the user flow:

**navigation**

* navigate to `/list/popular`

**timespan**

* navigate from popular -> top_rated by clicking navigation item
* wait for navigation event to be happened
* wait for movies to be rendered

**snapshot**

analyze current state

**timespan**

* click search-bar
* enter search term
* wait for movies to be rendered

**timespan**

* select a movie-card item
* click movie-card item to navigate to movie-detail
* wait for navigation event
* wait for movies to be rendered

**snapshot**

analyze current state

## Project setup

make sure you've installed the `@push-based/user-flow` package.

If no, please do so now:

```bash
npm install @push-based/user-flow -D
```

### Configuration

You should notice a `.user-flowrc.json` sitting in the root directory with the following contents

<details>
  <summary>.user-flowrc.json</summary>

```json
{
  "collect": { "url": "http://localhost:4200/list/popular", "ufPath": "./user-flows/flows" },
  "persist": { "format": ["html"], "outPath": "./user-flows/measures" },
  "assert": {}
}
```

</details>

### Flow Setup

There should also be an already existing `movies-flow.uf.ts` file, preconfigured for you to get
going:

<details>
  <summary>/user-flows/flows/movies-flow.uf.ts</summary>

```ts
// /user-flows/flows/movies-flow.uf.ts

// Your custom interactions with the page
import {
  createUserFlowRunner,
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions, page } = ctx;
  const { url } = collectOptions;
  
  await flow.navigate(url, {
    stepName: 'Navigate to popular page',
  });
  
  // your script goes here

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {
    name: 'Movie Audit',
    config: {
      settings: {
        throttlingMethod: 'devtools',
        output: ['json', 'html'],
        formFactor: 'desktop',
        screenEmulation: {
          height: 1080,
          width: 1920,
          mobile: false,
          deviceScaleFactor: 1
        }
      }
    }
  },
  interactions,
  launchOptions: {
    headless: false
  }
};

module.exports = userFlowProvider;

```

</details>

## Configure browser

If you encounter an issue with the browser installation, you can configure `puppeteer` to use 
an already existing browser installation.

You can also adjust the screen sizes and the viewport, if necessary.

For this, adjust the `executablePath` option in the `launchOptions` object of the `userFlowProvider`.

<details>
  <summary>executablePath config</summary>

```ts

const userFlowProvider: UserFlowProvider = {
  flowOptions: {
    /**/
  },
  /**/
  launchOptions: {
    headless: false,
    executablePath: '/path/to/browser' // <- here goes your browser
  }
};
```

</details>

## Configure throttling

The throttling can be configured according to the [official lighthouse docs](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md).

The default configuration uses a similar setup than the `desktopDense4G` setup listed in the [constants](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js).

```ts

const userFlowProvider: UserFlowProvider = {
  flowOptions: {
    name: 'Movie Audit',
    config: {
      settings: {
        throttlingMethod: 'devtools',
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 40, // 0 means unset
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
    },
  },
};
```

## Try out skeleton

If everything is set up and in place, go ahead and run the skeleton setup.

```bash
user-flow collect
```

If you want to have more information while debugging, run the script in `verbose` mode.

```bash
user-flow collect --verbose
```

A browser should open and run the initial `navigation` audit scripted in the existing flow file.

When the audit is finished, you should be presented with an html report of the audit being performed.

![lh-uf-report-1](images/user-flow/lh-uf-report-1.png)

## Timespan: popular -> top_rated

Now it's time to get hands on the code, let's script the first `timespan` event.

**Timespan description**

* navigate from popular -> top_rated by clicking navigation item
* wait for navigation event to be happened
* wait for movies to be rendered

For this, open the `/user-flows/flows/movies-flow.uf.ts` file.

The things we will interact with are the puppeteer [`Page`](https://pptr.dev/api/puppeteer.page)
object and the [`lighthouse flow`](https://github.com/GoogleChrome/lighthouse/blob/af04a9c2af6068f25be56d56a52e1da62ea1d022/core/user-flow.js#L54) object.

The methods from the flow object of interest are:

* `navigate`
* `startTimespan`
* `endTimespan`
* `snapshot`

Start by scripting the first `timespan` by using the `flow.startTimespan` and `flow.endTimespan` 
methods.

<details>
  <summary>Navigate to Top Rated page Timespan scaffold</summary>

```ts

/* code before */

/* Navigation was already here */
await flow.navigate(url, {
  stepName: 'Navigate to popular page',
});

// this is the new code

await flow.startTimespan({ stepName: 'Navigate to Top Rated Page' });

// custom code interacting with the page goes here

await flow.endTimespan();
```

</details>

Now that the `timespan` event is scaffolded, script the events needed to do
the actual navigation. You probably want to use the `page.click()` method and 
select the `a[href="/list/top_rated"]` link.

If you have added a `data-test` attribute or any other identifier, you can use this instead.

As a last step, you also want to wait for the rendering process to be finished.
There are different ways how to implement this, just naming some:

* wait for a particular movie being rendered on the page `page.waitForSelector('select a movie')`
* wait for the api responding with values: `page.waitForResponse('https://api.themoviedb.org/3/movie/top_rated')`
* wait for a navigationevent and the network being idle `page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 2000 })`

You can use `Promise.all` to combine the `click` with any other Promise you want to wait for

<details>
  <summary>Navigate to Top Rated page Timespan scaffold</summary>

```ts

await flow.startTimespan({ stepName: 'Navigate to top rated' });

await Promise.all([
  // navigate
  page.click('a[href="/list/top_rated"]'),
  // wait for api response
  page.waitForResponse('https://api.themoviedb.org/3/movie/top_rated?page=1&sort_by=popularity.desc'),
  // wait for specific movie in the dom
  page.waitForSelector('movie-card[data-test="240"]')
]);

await flow.endTimespan();
```

</details>

**Great**, test your script by running `user-flow collect`.
If everything went well, you should be presented with a `movie-audit.html`
showing now all steps of the existing user flow in a single audit.

Inspect and navigate around your results! They should look similar to the following
screenshots.

**Summary**

![lh-uf-summary-2](images/user-flow/lh-uf-summary-2.png)

**Select Navigation**

![lh-uf-navigation-2](images/user-flow/lh-uf-navigation-2.png)

**Use Breadcrumb**

![lh-uf-timespan-2](images/user-flow/lh-uf-timespan-2.png)


## Snapshot

Let's inspect 


Insert a `flow.snapshot()` call as a last step of the script and execute the audit with `user-flow collect`.

<details>
  <summary>Final Snapshot</summary>

```ts

/* code before */

flow.snapshot();

```

</details>

**Nice**, execute the cli with `user-flow collect` and inspect the newly created report.

You should now see a third audit being added to the summary. 
We are already getting to a usable state here. But let's keep on our efforts!

## Timespan: search movie

Now it's time to add a slightly more complex timespan.
* click search-bar
* enter search term
* wait for movies to be rendered

No worries, you don't have to code this one by hand. We will use an exported `recorder` script
that does the magic for us.

For this, open your browser at the movies application and the `recorder` tab in your `DevTools`.

![recorder tool](images/user-flow/user-flow-recorder.png)

Now press the `Start a new recording` or `+` button to start a new recording.

Give it a name and prepare yourself for interacting with the application.

Record a search for `e.g.` `Batman`, wait for the list being rendered and end the recording.

<details>
  <summary>Record a search</summary>

![record-search-movie.gif](images/user-flow/record-search-movie.gif)

</details>

Your recording should look similar to the following screenshot. Make sure to test it out by using the `Replay` function.

![record-search](images/user-flow/lh-uf-record-search.png)

As you did last time, inspect the generated `selectors` and adjust them if needed.
You may also want to introduce new steps as `waitForElement` or `waitForNavigation`.

If you are happy with your result, export the recorder script as json.

> **Pro Tip:** add a `waitForElement` step which waits for one of the searched movies
> use the `data-test` attribute to identify the element, e.g. `movie-card[data-test="272"]` for `Batman Begins`

![recorder-export-to-json](images/user-flow/recorder-export-to-json.png)

Move the generated json file to the movies app repository. I suggest the following path:
`/user-flows/search-movies.json`.

Now it's time to **adjust / delete** parts of the generated json, as there was stuff generated we not
need.

Make sure to delete the two initially created steps that are of type `setViewport` and `navigate`.

![remove-recorder-parts](images/user-flow/lh-uf-remove-recorder-parts.png)

Below you find a working example if you are experiencing any issues with the process.

<details>
  <summary>Working example: search-movies.json</summary>

```json
{
  "title": "search for movie",
  "steps": [
    {
      "type": "click",
      "target": "main",
      "selectors": [
        [
          "body > app-root > app-shell > div > div.ui-toolbar > div > ui-search-bar > form"
        ],
        [
          "xpath//html/body/app-root/app-shell/div/div[1]/div/ui-search-bar/form"
        ]
      ],
      "offsetY": 21.399999618530273,
      "offsetX": 24.0499267578125
    },
    {
      "type": "change",
      "value": "batman",
      "selectors": [
        [
          "aria/Search Input"
        ],
        [
          "body > app-root > app-shell > div > div.ui-toolbar > div > ui-search-bar > form > input"
        ],
        [
          "xpath//html/body/app-root/app-shell/div/div[1]/div/ui-search-bar/form/input"
        ],
        [
          "text/a search"
        ]
      ],
      "target": "main"
    },
    {
      "type": "keyDown",
      "target": "main",
      "key": "Enter"
    },
    {
      "type": "keyUp",
      "key": "Enter",
      "target": "main"
    },
    {
      "type": "waitForElement",
      "target": "main",
      "frame": [],
      "selectors": [
        [
          "movie-card[data-test=\"272\"]"
        ]
      ]
    }
  ]
}


```

</details>

Okay, all the preparation work is done, let's integrate our recorded flow into our audit script.
Go back to the `movies-flow.uf.ts` file and create a new `timespan` with the name `Search A Movie`.

In between `startTimespan` and `endTimespan` you want to execute the recorded script.
For this, create a new `const runner = await createUserFlowRunner('./user-flows/search-movie.js', ctx)`.
To run the recording, call `await runner.run();`

<details>
  <summary>Timespan: Search a Movie</summary>

```ts
await flow.startTimespan({ stepName: 'Search A Movie' });
// Use the create function to instanciate a the user-flow runner.
const runner = await createUserFlowRunner('./user-flows/search-movie.json', ctx)
await runner.run();

await flow.endTimespan();

```

</details>

**Amazing**, please run your script with `user-flow collect` and inspect the outcome of your current audit.
You now be able to see another audit added to the report, representing the recorded flow :)

**Summary**

![summary](images/user-flow/lh-uf-summary-3.png)

**Detail**

![user-recording](images/user-flow/lh-uf-user-recording-3.png)

## Timespan: navigate to detail & final snapshot

As a final step to 100% complete our audit, let's implement a last `timespan`
that selects a movie from the list and navigates to its detail page.

You should now be aware of how add a new `timespan`. Add a new timespan called `Select A Movie`.
You can choose to handpick a movie or just click the first one available.
You can also choose to create a recording and let run the `json` file or handcraft it 
with javascript.

The idea is to click e.g. `movie-card:first-child` and wait for the `div.grid--item.gradient` to appear at the screen.

<details>
  <summary>Timespan: Select A Movie</summary>

```ts

await flow.startTimespan({ stepName: 'Select A Movie' });
await Promise.all([
  page.click('movie-card:first-child'),
  page.waitForSelector('div.grid--item.gradient'),
]);
await flow.endTimespan();

```

</details>

**Great!!!!** We are almost there. The last thing we want to add to our audit is a final `snapshot` showing us the final
state of the application after our user journey.

**Final Snapshot**

As a final step, we want to analyze the current state after the whole user flow has finished.

Insert a `flow.snapshot()` call as a last step of the script and execute the audit with `user-flow collect`.

<details>
  <summary>Final Snapshot</summary>

```ts

/* code before */

flow.snapshot();

```

</details>

**Congratulations**, you have successfully implemented a real world usable user flow. 
Please inspect the final outcome and be **proud of yourself**! You have built a really nice piece of
software :claps:



## Full Solution

<details>
  <summary>Full Solution</summary>

```ts

const { flow, collectOptions, page } = ctx;
const { url } = collectOptions;

await flow.navigate(url, {
  stepName: 'Navigate to Popular',
});

await flow.startTimespan({ stepName: 'Navigate to Top Rated' });

await Promise.all([
  // navigate
  page.click('a[href="/list/top_rated"]'),
  // wait for api response
  page.waitForResponse(
    'https://api.themoviedb.org/3/movie/top_rated?page=1&sort_by=popularity.desc'
  ),
  // wait for specific movie in the dom
  page.waitForSelector('movie-card[data-test="240"]', { timeout: 5000 }),
]);

await flow.endTimespan();

await flow.snapshot();

await flow.startTimespan({ stepName: 'Search A Movie' });
// Use the create function to instanciate a the user-flow runner.
const runner = await createUserFlowRunner(
  './user-flows/search-movie.json',
  ctx
);
await runner.run();

await flow.endTimespan();

await flow.startTimespan({ stepName: 'Select A Movie' });
await Promise.all([
  page.click('movie-card:first-child'),
  page.waitForSelector('div.grid--item.gradient'),
]);
await flow.endTimespan();

await flow.snapshot();

```

</details>

![uf-final-audit](images/user-flow/lh-uf-final-audit.png)

## Bonus: Battletest your improvements

With the existing user-flow setup, you can run tests on the default branch and a branch with
all of your improvements in place.
See how metrics like `LCP` & `INP` are improved.

## Bonus: (if you've got the time for it :)) Implement Scroll Timespan

In the same manner as before, integrate a new flow that involves scrolling the list
so that the pagination is triggered.
