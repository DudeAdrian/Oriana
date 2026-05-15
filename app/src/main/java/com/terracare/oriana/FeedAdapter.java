```java
import com.swarmarchitects.feedadapter.FeedAdapter;
import com.swarmarchitects.feedadapter.SwipedItem;

public class FeedAdapterTiktokVerticalScroll extends FeedAdapter {

    public FeedAdapterTiktokVerticalScroll() {
        super();
    }

    @Override
    protected String getItemType(SwipedItem swipedItem) {
        return "tiktok-vertical-scroll";
    }
}
```

