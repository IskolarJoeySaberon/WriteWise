# How to Make Your GitHub Repository Private

This guide will help you change your WriteWise repository from public to private.

## Steps to Make Repository Private

### Method 1: Using GitHub Web Interface (Recommended)

1. **Navigate to your repository**
   - Go to https://github.com/IskolarJoeySaberon/WriteWise

2. **Access Repository Settings**
   - Click on the **Settings** tab (it's in the top menu bar of your repository)
   - You need to be the repository owner or have admin access to see this tab

3. **Navigate to Danger Zone**
   - Scroll down to the bottom of the Settings page
   - You'll find a section called **"Danger Zone"**

4. **Change Visibility**
   - In the Danger Zone section, look for **"Change repository visibility"**
   - Click the **"Change visibility"** button
   - A dialog will appear with options: Public and Private

5. **Select Private**
   - Choose **Private**
   - GitHub will ask you to confirm by typing the repository name: `IskolarJoeySaberon/WriteWise`
   - Type the repository name exactly as shown
   - Click **"I understand, change repository visibility"**

### Method 2: Using GitHub CLI (Alternative)

If you have GitHub CLI installed, you can use this command:

```bash
gh repo edit IskolarJoeySaberon/WriteWise --visibility private
```

## What Happens When You Make a Repository Private?

- ✅ Only you and collaborators you explicitly invite can access the repository
- ✅ The repository won't appear in search results
- ✅ Your code, issues, pull requests, and all content remain intact
- ✅ All existing Git history is preserved
- ⚠️ If you had GitHub Pages enabled, it will be disabled (private repos need GitHub Pro for Pages)
- ⚠️ Forks of your repository will be detached (if any exist)

## Important Notes

- **Free GitHub accounts** can have unlimited private repositories
- If you want to make it public again later, you can follow the same steps and choose "Public" instead
- Your local repository clone is not affected by this change
- All your existing commits and branches remain unchanged

## Need Help?

If you encounter any issues or have questions:
- Visit [GitHub Documentation on Repository Visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- Contact GitHub Support at https://support.github.com/

---

**Current Repository Status:** Public  
**Repository URL:** https://github.com/IskolarJoeySaberon/WriteWise
